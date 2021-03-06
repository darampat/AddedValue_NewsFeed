const express = require('express');
const router = express.Router();
const webhoseio = require('../config/Webhose');
const User = require('../model/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    // Εάν υπάρχει παράμετρος στο index, πήγαινε στο route /search
    if (Object.keys(req.query).length != 0) {
        res.redirect('/search?q=' + req.query.q);
    }
    // Εάν ο χρήστης είναι συνδεδεμένος, εμφάνισε ειδήσεις σχετικές με τις προτιμήσεις του
    if (req.session.auth) {
        const authProvider = req.session.authProvider;
        const user = req.session.user;
        User.findOne({'authProvider.id': 'user.id'}, function (err) {
            let rawQuery = '';
            if (authProvider === 'facebook') {
                rawQuery = user.facebook.pref;
            } else {
                rawQuery = user.it.pref;
            }
            let query = '';
            // Για κάθε εγγραφή του πεδίου pref, θα προστίθεται μετά το κείμενο ένα OR
            // και θα κάνει όλα αυτά που του αρέσουν αναζήτηση
            for (let i in rawQuery) {
                query += '"' + rawQuery[i] + '" OR ';
            }
            query = query.replace((/ OR $/), '');
            console.log('Query to search = ' + query);
            webhoseio.client.query('filterWebContent', webhoseio.makeQuery(query, 'news')).then(output => {
                res.render('index', {
                    title: 'Express',
                    output: output,
                    login: req.session.auth,
                    user: req.session.user,
                    authProvider: req.session.authProvider,
                    query: query
                });
            });
        });
    } else {
        // αλλιώς εμφάνισε τυχαίο περιεχόμενο
        webhoseio.client.query('filterWebContent', webhoseio.makeQuery('language:greek', 'news')).then(output => {
            console.log('GET / - fortosi selidas XWRIS paramertous');
            console.log('passport user = = ' + JSON.stringify(req.session.user));
            res.render('index', {
                title: 'Express',
                output: output,
                login: req.session.auth,
                user: req.session.user,
                query: "Greek news"
            });
        })
    }
});

router.get('/search', (req, res, next) => {
    const query = req.sanitize(req.query.q);
    // Η είσοδος του χρήστη γίνεται sanitize (Για λόγους ασφαλείας)
    console.log('GET /q=' + query + ' - fortosi selidas ME paramertous');
    if (!query) {
        console.log('ERROR RETURN');
        next();
    } else {
        webhoseio.client.query('filterWebContent', webhoseio.makeQuery(query, 'news')).then(output => {
            res.render('index', {
                title: 'Express',
                output: output,
                login: req.session.auth,
                user: req.session.user,
                authProvider: req.session.authProvider,
                query:query
            });
        })
    }
}, (req, res) => {
    // if error, send status "404" and text "Not Found!"
    res.status(404).send('Not Found!');
});

router.post('/getNext', (req, res, next) => {
    // Get next batch of posts for pagination
    webhoseio.client.getNext().then(output => {
        res.send(output);
    });
});


router.get('/logout', (req, res, next) => {
    // Get next batch of posts for pagination
    req.session.destroy(function(err) {
        res.redirect('/');
    })
});
module.exports = router;
