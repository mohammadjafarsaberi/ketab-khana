# Ketab Khana

Ketab Khana is a modern digital library built with Laravel and Inertia React. It provides a public catalog for discovering books, authenticated favorites and downloads, and a role-protected administration panel for managing library content and member activity.

## Features

- Public, responsive book catalog and detail pages
- Search, filtering, sorting, categories, authors, and languages
- Typesense-powered search with an automatic database fallback
- User registration, authentication, Google OAuth, favorites, and download history
- Protected downloads from private storage
- Role-based access with `admin` and `user` roles
- Admin management for books, files, authors, categories, users, and review moderation
- Read-only admin reports for downloads and favorites
- Light public interface with a responsive admin dashboard

## Technology stack

- [PHP](https://www.php.net/downloads.php) 8.3 or newer
- [Laravel](https://laravel.com/framework/docs) 13
- [Inertia.js](https://inertiajs.com/) 3 and [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite) 4
- [Laravel Scout](https://laravel.com/docs/scout) and [Typesense](https://typesense.org/docs/guide/install-typesense.html)
- [Laravel Fortify](https://laravel.com/docs/fortify) and [Laravel Socialite](https://laravel.com/docs/socialite)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
- SQLite by default; other Laravel-supported databases may also be configured

## Requirements

Install the following before setting up the project:

- [PHP and required Laravel tooling](https://laravel.com/framework/docs)
- [Composer 2](https://getcomposer.org/download/)
- [Node.js LTS and npm](https://nodejs.org/en/download)
- SQLite, MySQL, PostgreSQL, or another Laravel-supported database
- Typesense is optional for local development because database search is used as a fallback

Confirm the tools are available:

```bash
php --version
composer --version
node --version
npm --version
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ketab-khana
```

Replace `<repository-url>` with the HTTPS or SSH URL of this repository.

### 2. Install backend and frontend dependencies

```bash
composer install
npm install
```

### 3. Create the environment file

macOS or Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Set the application identity in `.env`:

```dotenv
APP_NAME="Ketab Khana"
APP_URL=http://localhost:8000
```

### 4. Configure the database

The example environment uses SQLite. Create the database file if it does not already exist.

macOS or Linux:

```bash
touch database/database.sqlite
```

Windows PowerShell:

```powershell
New-Item database/database.sqlite -ItemType File -Force
```

Then run the migrations and development seeders:

```bash
php artisan migrate --seed
```

The development seeder creates this administrator account:

```text
Email:    test@example.com
Password: password
```

These credentials are for local development only. Change or remove them before deploying the application.

To completely rebuild a development database later:

```bash
php artisan migrate:fresh --seed
```

> This command deletes all existing database records. Never run it against a production database.

### 5. Create the public storage link

```bash
php artisan storage:link
```

Book covers and author images are served through the public storage link. Downloadable book files remain in private storage and are only returned through the authenticated download controller.

### 6. Build or run the frontend

For active development, start Laravel, the queue listener, and Vite together:

```bash
composer run dev
```

Open `http://localhost:8000` in your browser.

Alternatively, run the processes separately:

```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

Run each command in a separate terminal.

For a production frontend build:

```bash
npm run build
```

## Typesense search

Typesense is optional during initial UI development. If it is unavailable, catalog searches automatically fall back to equivalent database queries.

### Run without Typesense

Set the Scout driver in `.env`:

```dotenv
SCOUT_DRIVER=database
```

Clear cached configuration after changing environment values:

```bash
php artisan config:clear
```

### Run with Typesense

Install or start a Typesense server by following the official [Typesense installation guide](https://typesense.org/docs/guide/install-typesense.html). Typesense Cloud, native Linux packages, binaries, and Docker are supported by Typesense.

Configure the connection in `.env`:

```dotenv
SCOUT_DRIVER=typesense
TYPESENSE_API_KEY=xyz
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
```

The API key must match the key used by the Typesense server. For hosted or production environments, use the hostname, HTTPS port, protocol, and secret supplied by the provider.

After Typesense is running, import active books into the search index:

```bash
php artisan scout:import "App\Models\Book"
```

To rebuild the book index:

```bash
php artisan scout:flush "App\Models\Book"
php artisan scout:import "App\Models\Book"
```

Only active, non-deleted books are searchable.

## Google authentication (optional)

Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), then add the following values to `.env`:

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

Ensure the redirect URI configured in Google exactly matches `GOOGLE_REDIRECT_URI`.

## Useful commands

| Task | Command |
| --- | --- |
| Start the complete development environment | `composer run dev` |
| Start Laravel only | `php artisan serve` |
| Start Vite only | `npm run dev` |
| Build frontend assets | `npm run build` |
| Run database migrations | `php artisan migrate` |
| Rebuild and seed the database | `php artisan migrate:fresh --seed` |
| Create storage links | `php artisan storage:link` |
| Import books into Scout | `php artisan scout:import "App\Models\Book"` |
| Run PHP formatting | `composer run lint` |
| Check PHP formatting | `composer run lint:check` |
| Check JavaScript formatting | `npm run format:check` |
| Check ESLint | `npm run lint:check` |
| Check TypeScript | `npm run types:check` |
| Run the test suite | `php artisan test --compact` |
| Run all CI checks | `composer run ci:check` |

## Application routes

| Area | URL | Access |
| --- | --- | --- |
| Home | `/` | Public |
| Catalog | `/books` | Public |
| My Library | `/my-library` | Authenticated users |
| Admin dashboard | `/admin` | Administrators only |

Administrators can open the admin panel from the profile menu after signing in.

## Project structure

```text
app/
├── Http/Controllers/       Laravel controllers
├── Http/Requests/          Request validation
├── Http/Resources/         Public response resources
├── Models/                 Eloquent models
├── Policies/               Authorization policies
└── Services/               Search and application services

resources/js/
├── components/             Shared React components
├── layouts/                Public and admin layouts
├── pages/                  Inertia pages
├── routes/                 Wayfinder-generated route helpers
└── types/                  TypeScript definitions

storage/app/private/        Protected downloadable files
storage/app/public/         Public covers and author images
```

## Security notes

- Never commit `.env`, private API keys, OAuth secrets, or production credentials.
- Use a strong Typesense API key outside local development.
- Keep downloadable files on the private disk.
- Change the seeded administrator password before exposing an environment publicly.
- Run production deployments with `APP_DEBUG=false` and HTTPS.
- Follow Laravel's official [deployment guidance](https://laravel.com/framework/docs/deployment).

## Contributing

Before opening a pull request:

```bash
composer run lint
npm run format
npm run lint
npm run types:check
php artisan test --compact
npm run build
```

Keep changes focused, follow the existing project conventions, and use conventional commit messages.

## License

This project is licensed under the MIT License.
