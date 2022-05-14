class PostComments{ 
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }

    //method to submit comment form using ajax
    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $('#comment-data').val('');
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button',newComment));
                    likeToggle($(' .newComment'), newComment);

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
        $('.commentData').val('')
    }


    //method to create comment in dom
    newCommentDom(comment){
        return $(`<li id="comment-${comment._id}">
            <small id="comment-delete-button">
                    <a  class="delete-comment-button" href="/comments/destroy/${comment._id}"><i class="fa-solid fa-trash"></i></a>
            </small>
            <a id="post-user" href="/users/profile/${comment.user._id}">
                ${comment.user.name}
            </a>
            <small id="like-button">
                <a class="toggle-like-button newComment" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                    0 Likes
                </a>
            </small>
            <br>
            <div id="comment-content">
                ${comment.content}
            </div>
        </li>`);
    }

    //method to delete comment
    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
}

let likeToggle = function(data){
    let self = data;
    let toggleLike = new ToggleLike(self);
    data.removeClass('newPost');
}