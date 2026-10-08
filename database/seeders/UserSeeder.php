<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make seeding idempotent to avoid unique constraint errors in repeated runs.
        $adminRole = Role::findOrCreate('admin', 'web');
        $userRole = Role::findOrCreate('user', 'web');

        $admin = User::query()->updateOrCreate(['email' => 'test@example.com'], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
        ]);
        $admin->syncRoles([$adminRole]);

        User::factory(99)->create()->each(fn (User $user) => $user->assignRole($userRole));
    }
}
