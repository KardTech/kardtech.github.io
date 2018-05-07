/**
 * @return {!Object} The FirebaseUI config.
 */
function getUiConfig() {
  return {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccess': function(user, credential, redirectUrl) {
        handleSignedInUser(user);
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      // The Provider you need for your app. We need the Phone Auth
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // another option is 'audio'
          size: 'invisible', // other options are 'normal' or 'compact'
          badge: 'bottomleft' // 'bottomright' or 'inline' applies to invisible.
        }
      }
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com'
  };
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  document.getElementById('user-signed-in').style.display = 'block';
  document.getElementById('user-signed-out').style.display = 'none';
  document.getElementById('name').textContent = user.displayName;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phoneNumber;
  if (user.photoURL){
    document.getElementById('photo').src = user.photoURL;
    document.getElementById('photo').style.display = 'block';
  } else {
    document.getElementById('photo').style.display = 'none';
  }
};


/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() {
  document.getElementById('user-signed-in').style.display = 'none';
  document.getElementById('user-signed-out').style.display = 'block';
  ui.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('loaded').style.display = 'block';
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Deletes the user's account.
 */
var deleteAccount = function() {
  firebase.auth().currentUser.delete().catch(function(error) {
    if (error.code == 'auth/requires-recent-login') {
      // The user's credential is too old. She needs to sign in again.
      firebase.auth().signOut().then(function() {
        // The timeout allows the message to be displayed after the UI has
        // changed to the signed out state.
        setTimeout(function() {
          alert('Please sign in again to delete your account.');
        }, 1);
      });
    }
  });
};

/**
 * Initializes the app.
 */
var initApp = function() {
  document.getElementById('sign-out').addEventListener('click', function() {
    firebase.auth().signOut();
  });
  document.getElementById('delete-account').addEventListener(
      'click', function() {
        deleteAccount();
      });
};
var database = firebase.database();

		database.ref('vendors').on('child_added', function(data) {
			add_data_table(data.val().vendorname,data.val().comments_vendor,data.val().phonenumber_vendor,data.val().balance_vendor,data.key);
			var lastkey = data.key;
			nextkey = parseInt(lastkey)+1;
		});
		database.ref('vendors').on('child_changed', function(data) {
			update_data_table(data.val().vendorname,data.val().comments_vendor,data.val().phonenumber_vendor,data.val().balance_vendor,data.key)
		});
		database.ref('vendors').on('child_removed', function(data) {
			remove_data_table(data.key)
		});

		function add_data_table(name,pic,email,balance,key){
			document.getElementById("#custable").append('<tr id="'+key+'"><th>'+name+'</th><th>'+email+'</th><th>'+pic+'</th><th>'+balance+'</th><th><a href="#" data-key="'+key+'" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="'+key+'">Remove</a></th></tr>');
			//<footer class="card-footer"><a href="#" data-key="'+key+'" class="card-footer-item btnEdit">Edit</a><a href="#" class="card-footer-item btnRemove"  data-key="'+key+'">Remove</a></footer>
			//$("#card-list").append('<div class="key" id="'+key+'"><div class="card"><div class="card-image"><figure class="image is-4by3"><img src="'+pic+'"></figure></div><div class="card-content"><div class="media"><div class="media-content"><p class="title is-4">'+name+'</p><p class="subtitle is-6">@'+email+'</p></div></div></div><footer class="card-footer"><a href="#" data-key="'+key+'" class="card-footer-item btnEdit">Edit</a><a href="#" class="card-footer-item btnRemove"  data-key="'+key+'">Remove</a></footer></div></div>');
		}
		function update_data_table(name,pic,email,balance,key){
			//$("#card-list #"+key).html('<div class="card"><div class="card-image"><figure class="image is-4by3"><img src="'+pic+'"></figure></div><div class="card-content"><div class="media"><div class="media-content"><p class="title is-4">'+name+'</p><p class="subtitle is-6">@'+email+'</p></div></div></div><footer class="card-footer"><a href="#" class="card-footer-item btnEdit"  data-key="'+key+'">Edit</a><a  data-key="'+key+'" href="#" class="card-footer-item btnRemove">Remove</a></footer></div>');
			//$("#card-list #"+key).html('<div class="card"><div class="card-image"><figure class="image is-4by3"><img src="'+pic+'"></figure></div><div class="card-content"><div class="media"><div class="media-content"><p class="title is-4">'+name+'</p><p class="subtitle is-6">@'+email+'</p></div></div></div></div>
			document.getElementById("#custable #"+key).html('<th>'+name+'</th><th>'+email+'</th><th>'+pic+'</th><th>'+balance+'</th><th><a href="#" data-key="'+key+'" class="card-footer-item btnEdit">Edit</a></th><th><a href="#" class="card-footer-item btnRemove"  data-key="'+key+'">Remove</a></th>');
		}
		function remove_data_table(key){
			//$("#card-list #"+key).remove();
			document.getElementById("#custable #"+key).remove();
			//console.log("key is "+key);
		}
		function new_data(name,email,pic,balance,key){
			database.ref('vendors/' + key).set({
				vendorname: name,
				phonenumber_vendor: email,
				comments_vendor : pic,
				balance_vendor : balance
			});
		}
		function update_data(name,email,pic,balance,key){
			database.ref('vendors/' + key).update({
				vendorname: name,
				phonenumber_vendor: email,
				comments_vendor : pic,
				balance_vendor : balance
			});
		}
		document.getElementById("#btnAdd").click(function() {
			document.getElementById("#txtName").val("");
			document.getElementById("#txtEmail").val("");
			document.getElementById("#txtPic").val("");
			document.getElementById("#txtType").val("N");
			document.getElementById("#txtKey").val("0");
			document.getElementById( "#modal" ).addClass( "is-active" );

		});
		
		document.getElementById("#btnSave" ).click(function() {
			if(document.getElementById("#txtType").val() == 'N'){
				database.ref('vendors').once("value").then(function(snapshot) {
					if(snapshot.numChildren()==0){
						nextkey = 1;
					}
					new_data(document.getElementById("#txtName").val(),document.getElementById("#txtEmail").val(),document.getElementById("#txtPic").val(),0,nextkey);
				});
			}else{
				update_data(document.getElementById("#txtName").val(),document.getElementById("#txtEmail").val(),document.getElementById("#txtPic").val(),0,document.getElementById("#txtKey").val());
			}
			document.getElementById("#btnClose").click();
		});
		document.getElementById(document).on("click",".btnEdit",function(event){
			event.preventDefault();
			key = document.getElementById(this).attr("data-key");
			database.ref('vendors/'+key).once("value").then(function(snapshot){
				document.getElementById("#txtName").val(snapshot.val().vendorname);
				document.getElementById("#txtEmail").val(snapshot.val().phonenumber_vendor);
				document.getElementById("#txtPic").val(snapshot.val().comments_vendor);		
				document.getElementById("#txtType").val("E");	
				document.getElementById("#txtKey").val(key);	
			});
			document.getElementById( "#modal" ).addClass( "is-active" );
		});
		document.getElementById(document).on("click",".btnRemove",function(event){
			event.preventDefault();
			key = document.getElementById(this).attr("data-key");
			database.ref('vendors/' + key).remove();
		})
		
		document.getElementById( "#btnClose,.btnClose" ).click(function() {
			document.getElementById( "#modal" ).removeClass( "is-active" );
		});
window.addEventListener('load', initApp);
