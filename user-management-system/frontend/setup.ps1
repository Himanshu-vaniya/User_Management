# Pages
$pages = "login", "dashboard", "users", "roles", "permissions", "profile", "settings", "not-found", "unauthorized"
foreach ($page in $pages) {
    ng generate component pages/$page --standalone=true --skip-tests=true
}

# Shared Components
$sharedComponents = "header", "sidebar", "footer", "loader", "breadcrumb", "confirm-dialog", "page-title", "empty-state", "error-state", "table", "search-box", "pagination", "no-data"
foreach ($comp in $sharedComponents) {
    ng generate component shared/components/$comp --standalone=true --skip-tests=true
}

# Core Services
$services = "api", "auth", "storage", "notification", "loading", "snackbar", "user", "role", "permission"
foreach ($svc in $services) {
    ng generate service core/services/$svc --skip-tests=true
}

# Core Guards
$guards = "auth", "guest", "role", "permission"
foreach ($guard in $guards) {
    ng generate guard core/guards/$guard --implements CanActivate --skip-tests=true
}

# Shared Models
$models = "user", "role", "permission", "api-response", "pagination", "login-request", "login-response", "menu", "breadcrumb", "error-response"
foreach ($model in $models) {
    ng generate interface shared/models/$model --type=model
}

# Core Interceptors
ng generate interceptor core/interceptors/auth --skip-tests=true
ng generate interceptor core/interceptors/error --skip-tests=true

# Environments
ng generate environments
