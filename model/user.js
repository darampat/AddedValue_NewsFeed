const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Αρχική Έκδοση: Στατικό πέρασμα για τις προτιμήσεις του χρήστη. Στο μέλλον θα παίρνουμε τις προτιμήσεις του
// χρήστη και θα τις εισάγουμε δυναμικά.
const userSchema = new Schema({
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String,
        pref: {
            type: Array,
            default: [
                'Ταξίδια',
                'Θεσσαλονίκη',
                'Σίνδος',
                'Αλεξανδρειο ΤΕΙ'
            ]
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    it: {
        id: String,
        token: String,
        name: String,
        email: String,
        pref: {
            type: Array,
            default: [
                'Γραφικά Υπολογιστών',
                'Τεχνολογία Πολυμέσων',
                'Δίκτυα Η/Υ',
                'Ευφυή Συστήματα',
                'Δίκτυα Ασύρματων και Κινητών Επικοινωνιών',
                'Διαδίκτυο των Πραγμάτων',
                'Ασφάλεια Πληροφοριακών Συστημάτων'
            ]
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }
});

const model = mongoose.model('User', userSchema);
module.exports = model;
