
import joinNamespace from './joinNs.js';


function main(){
   const socket = io('http://localhost:8080');

   socket.on('connect', ()=>{
        console.log(socket.id);
   })
   socket.on('nsInfo', (namespaces)=>{
        console.log(namespaces);
        const namespacesDiv = document.querySelector('.namespaces');
        namespacesDiv.innerHTML = ''; 
        namespaces.forEach((ns)=>{    
            namespacesDiv.innerHTML += ` <div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"></div>`;
        })

        const nsDivs = document.querySelectorAll('.namespace');
        nsDivs.forEach((ns)=>{

           ns.addEventListener('click', ()=>{
              const endpoint = ns.getAttribute('ns');
              console.log(endpoint);
           })
        })
        joinNamespace(namespaces[0].endpoint);
        
   })

}

main();






