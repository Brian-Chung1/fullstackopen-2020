describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      username: 'username',
      name: 'user',
      password: 'password',
    };
    cy.request('POST', 'http://localhost:3001/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.login({ username: 'username', password: 'password' });

      //this does not work because we log in through the backend to bypass ui (typing in forms is slow)
      // cy.get('.success')
      //   .should('contain', 'Successfully Logged In')
      //   .and('have.css', 'color', 'rgb(0, 255, 0)')
      //   .and('have.css', 'border-style', 'solid');

      cy.contains('blogs');
      cy.contains('username logged in');
      cy.contains('logout');
      cy.contains('New Blog');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('username');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'Wrong Credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');

      cy.get('html').should('not.contain', 'username logged in');
    });
  });

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'username', password: 'password' });
    });

    it('user can be logged out', function () {
      cy.get('#logout-button').click();
      cy.contains('Log in to application');
    });

    it('A blog can be created', function () {
      cy.get('#toggle-button').click();
      cy.contains('Create New');
      cy.get('#title').type('blog can be created');
      cy.get('#author').type('cypress');
      cy.get('#url').type('https://www.cypress.io/');
      cy.get('.createBlogButton').click();
      cy.contains('blog can be created');
    });

    it('A blog can be liked', function () {
      cy.createBlog({
        title: 'test blog',
        author: 'user',
        url: 'www.google.com',
        likes: 0,
      });
      cy.get('.blog').find('button').as('showDetailsButton');
      cy.get('@showDetailsButton').click();
      cy.get('.likeButton').click();
      cy.contains('1');
      cy.get('.likeButton').click();
      cy.contains('2');
    });

    it('A blog can be deleted by creator', function () {
      cy.createBlog({
        title: 'test blog',
        author: 'user',
        url: 'www.google.com',
        likes: 0,
      });
      cy.get('.blog').find('button').as('showDetailsButton');
      cy.get('@showDetailsButton').click();
      cy.get('.removeButton').click();
    });

    it('a blog cannot be deleted by a non creator', function () {
      cy.createBlog({
        title: 'test blog',
        author: 'user',
        url: 'www.google.com',
        likes: 0,
      });

      cy.get('#logout-button').click();
      cy.contains('Log in to application');

      const user = {
        username: 'anotherUsername',
        name: 'anotherUser',
        password: 'anotherPassword',
      };
      cy.request('POST', 'http://localhost:3001/api/users', user);

      cy.login({ username: 'anotherUsername', password: 'anotherPassword' });

      cy.get('.blog').find('button').as('showDetailsButton');
      cy.get('@showDetailsButton').click();
      cy.get('.removeButton').click();

      cy.get('.error')
        .should('contain', 'Request failed with status code 401: Unauthorized')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');
    });

    it.only('blogs are sorted based on likes', function () {
      cy.createBlog({
        title: 'test blog 1',
        author: 'user',
        url: 'www.google.com',
        likes: 0,
      });

      cy.createBlog({
        title: 'test blog 2',
        author: 'user',
        url: 'www.google.com',
        likes: 5,
      });

      cy.createBlog({
        title: 'test blog 3',
        author: 'user',
        url: 'www.google.com',
        likes: 4,
      });

      cy.get('.blog')
        .should('have.length', 3)
        .then(($blog) => {
          $blog.map((i, el) => {
            console.log(el.textContent);
            if (i === 0) expect(el).to.contain('test blog 2 user');
            if (i === 1) expect(el).to.contain('test blog 3 user');
            if (i === 2) expect(el).to.contain('test blog 1 user');
          });
        });
    });
  });
});
