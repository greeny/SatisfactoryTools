# Host for local browsing compiled version

## Apache2
```
#host here
```

## Nginx
```
server {
    listen 80;
    server_name your-host.localhost;
 
    root /path/to/your/directory/dist/browser;

    location / {
            try_files $uri /index.html$is_args$args;
    }
}
```

[Back to index](/)
