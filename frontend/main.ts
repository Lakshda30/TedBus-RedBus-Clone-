import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './src/app/app.module';

// Editor compatibility entry point. The Angular build still uses src/main.ts.
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
