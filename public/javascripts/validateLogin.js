function validateLogin()
{
const username=document.getElementById('username');
const password=document.getElementById('password');

if(username.value=='' || password.value=='')
    {
        alert('Please fill all fields');
        return false;
    }
    else
    {
        return true;
    }
}
    