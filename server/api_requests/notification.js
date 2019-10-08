module.exports = function(app, sequelize, models){

    console.log('\tnotification requests loaded');

    let Notification = models.Notification;

    /**
     *   This request gets all the notifications in the database.
     *   arguments :
     *               none
     *   returns :
     *               an json array of notifications
     */
    app.get('/notification', function(req, res){
        Notification.findAll()
            .then(notifications => {
                res.send({'notification': notifications});
            })
            .catch(err => {
                res.status(500).send({'error': err});
            });
    });

    /**
     *   This request gets a notification according to its id.
     *   arguments :
     *               id : the id of the notification
     *   returns :
     *               a json object containing the notification
     */
    app.get('/notification/:id', function(req, res){
        Notification.findByPk(req.params.id)
            .then(notification => {
                res.send({'notification': notification});
            })
            .catch(err => {
                res.status(500).send({'error': err});
            });
    });

    /**
     *  This requests creates a new notification with the content, user and team.
     *  arguments :
     *              content: the content of the notification
     *              user_id: the user id of the user targeted by the notification
     *              team_id: the team id of the team targeted by the notification
     *
     *  returns :
     *              a json object containing the created notification
     */
    app.post('/notification', function(req, res){
        Notification.create({
            content: req.body.content,
            user_id: req.body.user_id,
            team_id: req.body.team_id
        }).then(notification => {
            res.send({'notification': notification});
        }).catch(err => {
            res.status(500).send({'error': err})
        });
    });

    /**
     *  This requests updates a notification according to its id.
     *  arguments :
     *              id : the id of the notification
     *              content: the content of the notification
     *              user_id: the user id of the user targeted by the notification
     *              team_id: the team id of the team targeted by the notification
     *
     *  returns :
     *              the updated object
     */
    app.put('/notification/:id', function(req, res){
        Notification.update(
            {
                content: req.body.content,
                user_id: req.body.user_id,
                team_id: req.body.team_id
            },{
                where: {
                    id: req.params.id
                }
            }
        ).then(() => {
            Notification.findByPk(req.params.id)
                .then(notification => {
                    res.send({'notification': notification});
                })
                .catch(err => {
                    res.status(500).send({'error': err})
                });
        }).catch(err => {
            res.status(500).send({'error': err})
        });
    });

    /**
     *  This requests change the status of a notification to read
     *  arguments:
     *              id: the id of the notification
     *  returns:
     *              the updated notification
     */
    app.put('/notification/read/:id', function(req, res){
        Notification.update({
            status: 'read'
        },{
            where: {
                id: req.params.id
            }
        }).then(() => {
            Notification.findByPk(req.params.id)
                .then(notification => {
                    res.send({'notification': notification});
                })
                .catch(err => {
                    res.status(500).send({'error': err})
                });
        }).catch(err => {
            res.status(500).send({'error': err})
        });
    });

    /**
     *  This requests change the status of a notification to unread
     *  arguments:
     *              id: the id of the notification
     *  returns:
     *              the updated notification
     */
    app.put('/notification/unread/:id', function(req, res){
        Notification.update({
            status: 'unread'
        },{
            where: {
                id: req.params.id
            }
        }).then(() => {
            Notification.findByPk(req.params.id)
                .then(notification => {
                    res.send({'notification': notification});
                })
                .catch(err => {
                    res.status(500).send({'error': err})
                });
        }).catch(err => {
            res.status(500).send({'error': err})
        });
    });

    /**
     *  This requests deletes a notification according to its id.
     *  arguments :
     *              id : the id of the notification
     *  returns :
     *              a result being 1 if succeeded, 0 else
     */
    app.delete('/notification/:id', function(req, res){
        Notification.destroy({
            where: {
                id: req.params.id
            }
        }).then(result => {
            res.send({'result': result});
        }).catch(err => {
            res.status(500).send({'error': err})
        });
    });
};