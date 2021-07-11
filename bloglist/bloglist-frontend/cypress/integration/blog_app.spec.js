describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Admin',
      username: 'admin',
      password: 'qwerty',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.contains('log in').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('qwerty')
      cy.get('#login-button').click()
    })

    /*it('fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('asdqwe')
      cy.get('#login-button').click()
    })*/
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'admin',
        password: 'qwerty',
      }).then((response) => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('Add blog', function () {
      cy.contains('Add Blog').click()
      cy.get('#title').type('Otsikko')
      cy.get('#author').type('Testimies')
      cy.get('#url').type('www.testi.fi')
      cy.get('#add-blog').click()
      cy.contains('Otsikko')
    })

    it('blog can be liked', function () {
      cy.contains('Add Blog').click()
      cy.get('#title').type('Otsikko')
      cy.get('#author').type('Testimies')
      cy.get('#url').type('www.testi.fi')
      cy.get('#add-blog').click()

      cy.contains('Otsikko')
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains(1)
    })

    it('blog can be deleted', function () {
      cy.contains('Add Blog').click()
      cy.get('#title').type('Otsikko')
      cy.get('#author').type('Testimies')
      cy.get('#url').type('www.testi.fi')
      cy.get('#add-blog').click()

      cy.contains('Otsikko')
      cy.contains('view').click()
      cy.contains('remove').click()
    })

    it('sort blogs', function () {
      cy.contains('Add Blog').click()
      cy.get('#title').type('Otsikko')
      cy.get('#author').type('Testimies')
      cy.get('#url').type('www.testi.fi')
      cy.get('#add-blog').click()

      cy.contains('Add Blog').click()
      cy.get('#title').type('Otsikko2')
      cy.get('#author').type('Testimies2')
      cy.get('#url').type('www.testi2.fi')
      cy.get('#add-blog').click()

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0])
      })
    })
  })
})
