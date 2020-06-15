# Changelog

# 4.x release

## v4.0.0

-   Enhance: Modified both del APIs parameters. Now includes the header and body to comply\
    with HTTP specification. Removed redundant method parameter.
    -   header and body default to empty objects
-   Enhance: Created and exported all types used in the API to avoid installing and importing fetch\
    types from separate module.
    -   importing RequestData replaces interface RequestInit
    -   importing HeaderInit replaces interface HeadersInit
    -   importing FetchRequest replaces class Request
-   Enhance: Documentation
