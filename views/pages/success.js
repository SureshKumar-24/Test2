
<html>
    <head>
        <title>Google SignIn</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"></link>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <style>

        </style>
    </head>
    <body>
        <div class="container">
            <div class="jumbotron">
                <h1 class="text-primary text-center"><span class="fa fa-user"></span> Profile Information</h1>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="well">
                            <% if (user) { %>
                            <p>
                            <strong>Id</strong>: <%= user.id %><br>
                            <strong>Email</strong>: <%= user.emails[0].value %><br>
                            <strong>Name</strong>: <%= user.displayName %><br>
                            </p>
                            <% } %>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
        </html> 