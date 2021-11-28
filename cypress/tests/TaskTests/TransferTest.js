
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let user1 = makeid(6)
let user2 = makeid(6)

describe('this suite to send money between test users', () => {
    before(() => {
        cy.visit('')
        cy.registerNewUser(user1)
        cy.registerNewUser(user2)
    })


    context('transfer amount for test user', () => {

        before(() => {
            cy.loginUser(user1)
        })

        after(() => {
            cy.logoutUser()
        })

        it('veify show frinds page', () => {
            cy.get('[data-test="nav-contacts-tab"]').should('not.have.class', 'Mui-selected')
            cy.get('[data-test="nav-contacts-tab"]').click().should('have.class', 'Mui-selected')

            cy.url().should('include', 'contacts')
        });

        it('verify that create transaction exist ', () => {
            cy.get('[data-test="transaction-list-empty-create-transaction-button"]').should('be.visible')
            cy.get('[data-test="transaction-list-empty-create-transaction-button"]').click()
            cy.url().should('include', 'transaction/new')
        });

        it('verify search for test2 user', () => {
            cy.get('input[data-test="user-list-search-input"]').should('have.attr', 'placeholder')
            cy.get('input[data-test="user-list-search-input"]').focus().type(user2)

            cy.get('ul[data-test="users-list"] li').should('have.length', 1)
        });

        it('verify that select reciever to transfer money', () => {
            cy.get('ul[data-test="users-list"] li').first().click()

            cy.get('.MuiStep-root .MuiStepIcon-active').contains('2')
        });

        it('verify reciever username appearing in payment page', () => {
            cy.get('h2.MuiTypography-root').should('have.text', 'first ' + user2 + ' last ' + user2)
        });

        it('verify transfer amount with note', () => {
            cy.fixture("wallet").then(({ transaction }) => {
                cy.get('#amount').clear().type(transaction.amount).should('have.value', '$' + transaction.amount)
                cy.get('#transaction-create-description-input').clear().type(transaction.note)
            })

            cy.get('button[data-test="transaction-create-submit-payment"]').should('be.visible')
            cy.get('button[data-test="transaction-create-submit-payment"]').click()

            cy.get('[data-test="alert-bar-success"]').should('be.visible').and('have.class', 'MuiAlert-filledSuccess')
            cy.get('.MuiStep-root .MuiStepIcon-completed').should('have.length', 3)
        });

        it('veify that complete payment page contains correct transaction details', () => {
            cy.fixture("wallet").then(({ transaction }) => {
                cy.get('.MuiGrid-justify-content-xs-center > div:nth-child(1) > h2').contains('$' + transaction.amount.toFixed(2) + ' for ' + transaction.note)
            })

            cy.get('[data-test="new-transaction-return-to-transactions"]').click()
        });
    })

    context('make sure the amount are recieved with note', () => {
        let notification_count
        let transactionId
        before(() => {
            cy.loginUser(user2)

            // cy.loginUser('0oqskI')
        })

        after(() => {
            cy.logoutUser()
        })

        
        it('verify notification count is appeared', () => {
            cy.get('[data-test="nav-top-notifications-count"] > .MuiBadge-anchorOriginTopRightRectangle').should('not.have.class' , 'MuiBadge-invisible').and('be.visible')
            cy.get('[data-test="nav-top-notifications-count"] > .MuiBadge-anchorOriginTopRightRectangle').invoke('text').then( text => notification_count = text)
        });
        
        it('verify notifications page have same notification count', () => {
            cy.get('[data-test="nav-top-notifications-count"]').click()

            cy.url().should('include' , 'notifications')

            cy.get('[data-test="notifications-list"] li').should('have.length' , notification_count)
        });

        // it('verify that dismiss all notifications', () => {
        //     cy.get('[data-test="notifications-list"] li button').then(dismissButtons => {
        //         dismissButtons.map((index , button) => {
        //             button.click()
        //         });
        //     }).then(() => cy.get('[data-test="notifications-list"] li').should('have.length' , 0))
        // });

        it('verify that show transactions', () => {
            cy.get('[data-test="app-name-logo"]').click()

            cy.get('[data-test="nav-personal-tab"]').should('not.have.class', 'Mui-selected')

            cy.get('[data-test="nav-personal-tab"]').click().should('have.class', 'Mui-selected')

            cy.url().should('include' , 'personal')
        });

        it('verify list of transactions contains one transaction', () => {
            cy.get('[data-test="transaction-list"] li').should('have.length' , 1)
            cy.get('[data-test="transaction-list"] li').first().click()
            cy.wait(4000)
            cy.location('href').then( url => {
                url = `${url}`.split('/')
                transactionId = url[url.length - 1]
            }).then(() => {
                cy.url().should('include' , 'transaction/'+transactionId)
            })

        });

        it('verify show transaction details', () => {
            
            cy.fixture("wallet").then(({transaction}) => {
                cy.get(`[data-test="transaction-amount-${transactionId}"]` ).should('contain.text' , '$'+transaction.amount.toFixed(2))

            })
            cy.get(`[data-test="transaction-comment-input-${transactionId}"]`).type('note')

            cy.get(`[data-test="transaction-like-button-${transactionId}"]`).click()
        });
    })
})