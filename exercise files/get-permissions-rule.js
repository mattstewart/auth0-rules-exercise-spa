/*
 * Example Rule to retreive user permissions from an external web service,
 * persist the permissions in the user's app_metadata, and add them to the
 * returned id_token.
 * 
 * Replace YOUR_DOMAIN and YOUR_WEB_SERVICE_URL with actual values
 * before using rule.
 */

function(user, context, callback) {
    
    //get the user email address
    var userEmail = user.email;

    //get existing app_metadata
    user.app_metadata = user.app_metadata || {};

    //make http call to external service
    getPermissions(function(err, res, data) {

        if (err) {
            return callback(new UnauthorizedError('UNAUTHORIZED: An error has occured.'));
        }

        if (data) {
            //parse the response from the web service
            var allPerms = JSON.parse(data);

            // get permissions based on user email
            var userPermissions = filterPermissionsByEmail(userEmail, allPerms);

            if (userPermissions) {
              
                //add groups to user_metadata
                 user.app_metadata.permissions = userPermissions.groups;
              
                //add groups to idToken
                context.idToken['https://YOUR_DOMAIN.com/permissions'] = user.app_metadata.permissions;
              
                //persist groups to app_metadata
                auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
                    .then(function() {
                        return callback(null, user, context);
                    })
                    .catch(function(err) {
                        return callback('UNAUTHORIZED: ' + err);
                    });
            } else {
                return callback(new UnauthorizedError('UNAUTHORIZED: User does not belong to any groups.'));
            }

        } else {
            return callback(new UnauthorizedError('UNAUTHORIZED: No data returned.'));
        }
    });

    function getPermissions(cb) {
        request.get({
            url: 'YOUR_WEB_SERVICE_URL', //mock JSON response with groups
            timeout: 5000
        }, cb);
    }
  
    function filterPermissionsByEmail(userEmail, allPerms) {
        var perms = allPerms.filter(perms => perms.email === userEmail);

        //only return first result if there are multiple
        if (perms.length > 0) {
            return perms[0];
        } else {
            return null;
        }
    }

}