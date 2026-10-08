export default function AppLogo() {
    return (
        <>
            <img
                src="/images/logo-k.png"
                alt=""
                className="size-10 shrink-0 object-contain"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="public-headline truncate leading-tight font-bold text-[#6f2929] dark:text-sidebar-foreground">
                    Ketab Khana
                </span>
                <span className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Admin panel
                </span>
            </div>
        </>
    );
}
