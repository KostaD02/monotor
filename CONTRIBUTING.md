## File structure

The current structure is based on Nx best practices. At the start, I made a small mistake by wrapping both server-side and client-side code inside one library folder, they should be separated. For example:

- libs
  - auth
    - client-auth
    - server-auth

Since this structure is used by other modules, I'll keep it for now. However, I plan to extract them in the future.

Current structure:

- apps
  - client
  - client-e2e
  - server
  - server-e2e
- libs
  - admin
  - auth
  - calendar
  - home
  - metrics
  - notfound
  - schedule
  - settings
  - shared
  - shell

If module is used in server and client side as well it will be wrapped as mentioned.

If module is just for client side it will be like this architecture:

- module name
  - data-access
    - services
    - ...
  - features
    - shell
    - ...
    - ui

In the code, the `any` type isn't used (except for one instance in the [custom storage service](https://github.com/KostaD02/monotor/blob/main/libs/shared/services/client-services/src/lib/storage.service.ts#L49-L55) when setting the token for the window), so let's keep it that way.
