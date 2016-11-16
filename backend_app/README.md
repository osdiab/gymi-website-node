# backend_app

This contains the entirety of the backend application. It gets run on the server, not on the
browser.

This project is written in Node with Express. For some decent docs about Express, check out [the
official website](http://expressjs.com/).

## This project

The Express app defines routes like so:

1. Static assets. These are drawn from the `/public` folder.
1. API routes. All of these start with `/api`, and provide ways for the `frontend_app` to get data
   from the databases. See the `./routes/` folder for all the handlers that define how to respond to
   these requests
1. Catch-all route: Any routes that are not matched just output the same frontend web app, which
   handles routing on its own. This pre-renders the frontend app on the backend to save a bit of
   time for content to show up on the page, and also to allow search engines to read the contents of
   the page when they crawl it (they typically don't evaluate Javascript, so if you don't do this,
   you have no SEO).

Additionally, the `./db/` folder encapsulates interactions with the database, so that the actual
route handlers don't have to know anything about how the database works.

## Node

Node lets you run Javascript without a browser, so that it's like any other programming language.

In Node, people typically write code in an **asynchronous** way. That is, whenever your code might
do something that can fail, or take a long time, you provide those functions with a **callback
function**. Callbacks get called when the function completes, either indicating success or failure.

Nowadays there are two ways (and a hot, cool third way called `async/await` that I won't get into
here) that you commonly see this pattern play out. In the non-node case, you might see code like
this:

```
try {
		data = getDataFromDatabase();
		print(data)
} catch(err) {
		print("There was an error!");
}
```

The old-school node style of doing this with callback functions might look like this:

```
getDataFromDatabase((err, data) => { // this is newer JS lambda syntax for anonymous functions
		if (err) {
				print("There was an error!"); // in real JS, this would be console.log(...)
		}
		print(data);
});
```

**First thing:** notice there is no `try/catch` here. In node, you VERY RARELY throw errors! Instead,
callbacks typically make the first argument an error argument, which if it is present, represent an
error condition.

When you are writing a node app, you generally don't want to throw errors, because Javascript allows
errors to be uncaught; so if you forget to catch an error, it will cause your program to fatally
error out and your server to stop responding to requests! This is bad, so people generally do not
throw errors.

**Second**, note that the flow of the program is no longer "first get the data from the database, wait
for it to finish and then print the data"; instead it is more like "get the data, and whenever
you're done with that, print it." Therefore, node can do other things while you're waiting for the
data, instead of just sitting there while the potentially slow database call is happening.

The new hotness way of expressing the above JS example is by using **`Promises`**, which represent
*a placeholder for a value that will be populated later.* Here's an example:

```
// getDataFromDatabase() returns a promise, which you can call `then` on to provide a handler in
// success cases, or `catch` on in failure cases.
getDataFromDatabase().then((data) => {
		print(data);
}).catch((err) => {
		print("There was an error!");
});
```

This syntax is nice because a) the error and success cases are now separated, and b) when you have a
lot of asynchonous functions that need to happen one after the other, instead of getting a bunch of
callbacks that call each other and become extremely nested (the proverbial "callback hell"), you can
chain them with `then` calls.

For example, old school:

```
getDataFromDatabase((err, data) => {
		if (err) {
				print("There was an error!");
				return;
		}
		processData(data, (err, processedData) => {
				if (err) {
						print("There was an error!");
						return;
				}

				formatDataForPrinting(processedData, (err, formattedData) => {
						if (err) {
								print("There was an error!");
								return;
						}

						print(formattedData);
				});
		});
});
```

Yuck! But in `Promise`-land:

```
// each of the functions below return a promise, which you can call `then` on when it is ready to
// get the real data; or call `catch` on if something bad happens.
getDataFromDatabase().then(processData).then(formatDataForPrinting).then((formattedData) => {
		print(formattedData);
}).catch((err) => {
		// if any of the above parts fail, it calls this error handler
		print("There was an error!");
});
```

Much better.

## Express

Express is a node library that provides a web server. You can use it to make a web service using
Javascript.

It is structured as a series of **middlewares**. Middlewares are functions that define what happens
when a request comes in—they can either respond to the request by calling `res.send()` and NOT
calling the `next()` callback (i.e. the request has been handled, and Express can now handle another
one); or the middleware can process and modify the request in some way and then call
`next()` to queue up the next middleware in the chain.

Each middleware provides a function that takes in 3 arguments: `req`, `res`, and `next`. `req`
contains all the information about the incoming request. `res` represents the response you will send
back to the client; it has methods you can call to send data or store information between
middlewares in `res.locals`. Finally, `next()` is a function that triggers the next middleware in
the chain; if it is not called, future middlewares will not get called.

The express `get()`, `post()`, `put()`, `delete()`, ... method are syntax sugar that checks whether
or not the HTTP verb and the URL provided as its first arg are correct, pulls out any parameters you
define in the URL string and just calls the next middleware if there isn't a match.

One piece of magic worth explaining is that if a middleware provides 4 arguments instead of the
usual 3 in its callback—namely, **`err`**, `req`, `res`, and `next`—it is treated as a special
"error" handler that gets called if an error occurred in a previous step (if you call `next` with an
argument, that argument is considered an error, just like in the old-school callback paradigm). So,
in this codebase, you can see that there is such a middleware that catches all the errors the rest
of the application produces, and cleanly returns a 400 or 500 level error in response.

For more details on how it all works, see the resources above.
