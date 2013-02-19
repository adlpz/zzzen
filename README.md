zzzen
=====

Hi there, this is *zzzen*, a really simple mustache-templated, markdown-formatted, mongodb-backed, 
static blogging engine written in Node.

## Structure

*Zzzen* itself consists of a REST-like API that interacts with a MongoDB Database for persistency and 
allows the common CRUD operations of a blogging system.

The information stored in the database is then exposed through the generation of a collection of static
files representing the blog posts, as well as a front page.

## Internalities

*Zzzen* works on node.js. Therefore, it will be run with (by default on localhost:8080):

```
$ cd api/
$ node zzzen.js
```

In order to circumvent same-origin-policies, we must pipe this service through whatever server we are using
for our static resources. For example, on Apache, you'd set the following on your VirtualHost definition:

```
<VirtualHost *:80>
  [...]
	ProxyRequests Off
	ProxyPass /rest http://localhost:8080
	ProxyPassReverse /rest http://localhost:8080
</VirtualHost>
```

Becoming then `/rest` the endpoint for the API. Writing methods (POST, DELETE) are password-protected through
HTTP Basic Authentication and the credentials can be set at `api/config.js`.

## Administration

You can access the administration interface at `/admin`. *Make sure you set up a password there with whatever
server you are using if you want no one to be able to se it!*.

Whenever you feel like your site is ready to be updated, just press `render` and *Zzzen* will regenerate the posts
list and front page for you.

## More

Zzzen is very much a personal project. I just prefer to have my own system when it comes to blogging and that's why
this exists. So if it is buggy, I'm sorry! I'm always working to improve it :).
