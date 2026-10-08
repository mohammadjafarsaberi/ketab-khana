<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $adminRole = Role::findOrCreate('admin', 'web');
        $userRole = Role::findOrCreate('user', 'web');

        User::query()->eachById(function (User $user) use ($adminRole, $userRole): void {
            $user->syncRoles([$user->email === 'test@example.com' ? $adminRole : $userRole]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        User::query()->eachById(fn (User $user) => $user->syncRoles([]));
    }
};
