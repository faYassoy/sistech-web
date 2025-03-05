import {  usePage } from '@inertiajs/react';
export default function AppLogo() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const logo = usePage().props.general.logo;

    console.log(logo);
    return (
        <>
           
            <img className='h-16' src={logo} alt="Company Logo" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold text-red-950">Entry Barang</span>
                <span className="mb-0.5 truncate leading-none font-semibold text-red-950">Dan Surat Jalan</span>
            </div>
        </>
    );
}
