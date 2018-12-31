//book class represent a book 
class Book {

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class : handle UI Tasks
class UI {
    static displaybooks() {
       
        const books = Store.getBooks();
        books.forEach((book)=> UI.addBookToList(book));
    }
     static  addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
     }

     static deleteBook(el) 
     {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();

        }
     }


     //alert to UI
     static showAlert(message, className) 
     
     {
         
         const div = document.createElement('div');
         div.className = `alert alert-${className}`;
         div.appendChild(document.createTextNode(message));
         //placing it in parent class which is container

         const container = document.querySelector('.container');
         const form = document.querySelector('#book-form');
         container.insertBefore(div, form);

         //vanish the alert after it popup 
         setTimeout(() =>document.querySelector('.alert').remove(),3000);


     }


     //clearing fields after submit
     static clearFields()
     {
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
     }
}


//Store class: storage    local storage only accept string values 
class Store {

    static getBooks(){

        let books;
        if(localStorage.getItem('books')===null) 
        {
            books =[];  //empty array in Js
        }else {
            books = JSON.parse(localStorage.getItem('books')); //converting JS object to and from JSON

        }
        return books;        
    }

    static addBook(book)
    {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn) 
    {
        const books = Store.getBooks();
        books.forEach((book, index)=>{
            
            if(book.isbn === isbn)
            {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));

    }
}



//Event : Display book 
document.addEventListener('DOMContentLoaded',UI.displaybooks);



//Event : Add a book 
document.querySelector('#book-form').addEventListener('submit',(e) => {

    //prevent actual submit 
    e.preventDefault();

    //Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const  isbn  = document.querySelector('#isbn').value;


    //validate
    if(title === ''||author === '' || isbn === '')
     {
        UI.showAlert('Please fill in all blanks','danger');
     }
     else {


          //instantiate book 
        const book = new Book(title, author, isbn);
        
        //ADd book to UI
        UI.addBookToList(book);
        

        //add book to store
        Store.addBook(book);

        //
        UI.showAlert('Book added','success');

        //clear fields 
        UI.clearFields();
        
       }
});

//Event : Remove a book -- Event Propagation 
document.querySelector('#book-list').addEventListener('click', (e) => {

//remove book from UI
 UI.deleteBook(e.target)


 //remove Book from store 
 Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
 UI.showAlert('Book Removed','success');

});
   


