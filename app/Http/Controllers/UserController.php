<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $search = $request->query('search');

    $users = User::query()
        ->when($search, fn($query) => 
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
        )
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('users/index', ['users' => $users, 'search' => $search]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('users/formUsers');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'sales_person'])],
            'is_active' => 'boolean',
        ]);

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'is_active' => $validated['is_active'] ?? false,
            ]);

            return redirect()->route('users.index')->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create user: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
        $data['user'] = User::find($id);
        return Inertia::render('users/formUsers',$data);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => ['sometimes', 'required', Rule::in(['admin', 'sales_person'])],
            'is_active' => 'boolean',
        ]);

        try {
            $user->update([
                'name' => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
                'password' => array_key_exists('password', $validated) && $validated['password']
                    ? Hash::make($validated['password'])
                    : $user->password,
                'role' => $validated['role'] ?? $user->role,
                'is_active' => $validated['is_active'] ?? $user->is_active,
            ]);

            return redirect()->route('users.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to update user: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete user: ' . $e->getMessage()]);
        }
    }
}
