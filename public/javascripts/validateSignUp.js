function validateSignUp()
{
const username=document.getElementById('username');
const email=document.getElementById('email');
const password=document.getElementById('password');
const confirmPassword=document.getElementById('confirmPassword');

if(username.value=='' || email.value=='' || password.value=='' || confirmPassword.value=='')
    {
        alert('Please fill all fields');
        return false;
    }
    else if(username.value !=='' && email.value!=='' && password.value !=='' && confirmPassword.value !=='')
    {
        if(password.value.length<8){
            alert('Password must have a minimum of 8 characters');
            return false;
        }
        else if(password.value.length>=8){
            if(password.value !== confirmPassword.value){
            alert('Password does not match.Please confirm');
            return false;
        }
        else{
            return true;
        }
}
    }
}
    