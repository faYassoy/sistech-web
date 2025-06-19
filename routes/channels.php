<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('admin.notifications', function () {
    return auth();
});
