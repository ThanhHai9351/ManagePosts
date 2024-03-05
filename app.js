const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const postsPerPage = 10; // Số lượng bài viết trên mỗi trang
let currentPage = 1;
var listPostsBlock = $('#list-posts')
var total = 0;

var postApi = 'https://jsonplaceholder.typicode.com/posts';

function Start()
{
    getPosts(renderPosts);
    handleCreateForm();
    handlePagination(total);
}

Start();


function creratePost(data, callback) {
    fetch(postApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function(res) {
            return res.json(); 
        })
        .then(callback)
}

function handleDeletePost(id)
{
    fetch(postApi+'/'+id,{
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json'
        }
    })
        .then(function(res)
        {
            res.json();
        })
        .then(function(){
            var postItem = $('.post-item-'+id)
            if(postItem)
            {
                postItem.remove();
            }
        });
}

function  deletePost(id){
    handleDeletePost(id)
}

function renderPosts(posts) {
    var listPostBlock = $('#list-posts');
    var startIndex = (currentPage - 1) * postsPerPage;
    var endIndex = startIndex + postsPerPage;
    var paginatedPosts = posts.slice(startIndex, endIndex);

    var htmls = paginatedPosts.map(function(post) {
        return `
        <div class="card post-item-${post.id} col-md-3 m-1" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">Xóa</button>
            </div>
        </div>
        `;
    });

    listPostBlock.innerHTML = htmls.join('');
}


function  handleCreateForm()
{
   var  btnCreate = $("#btncreate")

   btnCreate.onclick  = function(){
        var title = $('input[name="title"]').value;
        var body = $('input[name="body"]').value;

        var formdata = {
            title: title,
            body : body
        }


        console.log("Thực hiện action create Post với Title= "+title,"body= "+body)

        creratePost(formdata, function(){
            getPosts(renderPosts);
        })
   };
}


function handlePagination(totalPosts) {
    var totalPages = Math.ceil(totalPosts / postsPerPage);
    var paginationHTML = '';

    for (var i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="btn btn-outline-primary" onclick="goToPage(${i})">${i}</button>`;
    }

    $('#pagination').innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    $('#page').innerHTML= "Bạn đang ở page "+ page; 
    getPosts(renderPosts);
}

function getPosts(callback) {
    fetch(postApi)
        .then(res => res.json())
        .then(posts => {
            total = posts.length;
            callback(posts);
            handlePagination(posts.length);
        });
}