

describe('Cobra Game', () => {

    it('should log in the user', () => {

        cy.visit('http://localhost:5173');

        cy.get('#email').type('anton@email.com');
        cy.get('#password').type('Dajmkryss1234@');

        cy.get('.login-form').submit();
    })

    it('should get the user', () => {
        cy.intercept('GET', 'http://localhost:5173/get-user', {
            statusCode: 200,
        });

        cy.get
    })
})