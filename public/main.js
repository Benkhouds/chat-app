

import joinNs from './joinNs.js'


   let username = ''; 
   const usernameForm = document.getElementById('username-form');
   usernameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      username = document.getElementById('username').value;
      if(username.trim()){
         document.querySelector('.veil').classList.add('hidden');
         document.querySelector('.modal').classList.add('hidden');
         document.querySelector('.error').classList.add('hidden');
         main()
      }
      else{
         document.querySelector('.error').classList.remove('hidden');
      }
   });


function main(){
      const socket = io('http://localhost:8080', {
         query:{ 
            username 
         }
      });
      socket.on('connect', ()=>{
           console.log(socket.id);
      })
      let nsSocket = null ;
     
      socket.on('nsInfo', (namespaces)=>{
           console.log(namespaces);
           const namespacesDiv = document.querySelector('.namespaces');
           namespacesDiv.innerHTML = ''; 
           namespaces.forEach((ns)=>{    
               namespacesDiv.innerHTML += 
               ` <div class="namespace w-10 cursor-pointer transform transition hover:scale-125" ns="${ns.endpoint}"><img class="max-w-full" src="${ns.img}"></div>`;
           })
   
           const nsDivs = document.querySelectorAll('.namespace');
           nsDivs.forEach((ns)=>{
   
              ns.addEventListener('click', ()=>{
                  if(nsSocket){
                     nsSocket.close();
                  }
                 const endpoint = ns.getAttribute('ns');
                  nsSocket = joinNs(endpoint);
              })
           })
           nsSocket = joinNs(namespaces[0].endpoint);      
      })
}








