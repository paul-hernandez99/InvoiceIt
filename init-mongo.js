db.createUser({
    user: 'invoiceUser',
    pwd: 'passinvoice123',
    roles: [
        {
            role: 'readWrite',
            db: 'invoiceIt'
        }
    ]
});
