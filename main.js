
var url = 'https://geode-sdk.org/mods/';


var modsContainer = document.getElementById('mods-container');
var searchInput = document.getElementById('search-input');


var geodeCardCreated = false;


fetch(url)
  .then(response => response.text())
  .then(html => {

    var tempElement = document.createElement('div');
    tempElement.innerHTML = html;

  
    var modCards = tempElement.querySelectorAll('.mod-card');

    
    function filterMods() {
      var searchTerm = searchInput.value.trim().toLowerCase();

      modCards.forEach(modCard => {
        var modTitle = modCard.querySelector('h1').textContent.trim().toLowerCase();
        var modDescription = modCard.dataset.description.toLowerCase();

        if (searchTerm === '') {
          modCard.style.display = 'block'; 
        } else if (modTitle.includes(searchTerm) || modDescription.includes(searchTerm)) {
          modCard.style.display = 'block';
        } else {
          modCard.style.display = 'none';
        }
      });

   
      if (!geodeCardCreated && (searchTerm === '' || searchTerm.includes('geode'))) {
        createGeodeCard();
      } else if (geodeCardCreated && searchTerm !== '' && !searchTerm.includes('geode')) {
        removeGeodeCard();
      }
    }

    
    searchInput.addEventListener('input', filterMods);

   
    modCards.forEach(modCard => {
      modsContainer.appendChild(modCard);
    });

  
    function createGeodeCard() {
      var newModCard = document.createElement('article');
      newModCard.className = 'mod-card';
      newModCard.dataset.name = 'Geode';
      newModCard.dataset.developer = 'Geode Team';
      newModCard.dataset.description = 'Official Geode Modloader!';
      newModCard.dataset.about = 'About Geode';
      newModCard.dataset.tags = 'ModLoader';
      newModCard.dataset.defaultScore = '269';
      newModCard.style.display = 'block'; 

      var newModCardHTML = `
        <div class="info">
          <div class="img"><img src="assets/geode-logo.png"></div>
          <h1>Geode</h1>
          <h3><i class="author">Geode Team</i> • <i class="version">2.0.0</i></h3>
          <p class="short-desc">The official Geode Mod Loader!</p>
        </div>
        <div class="buttons"><a href="./geode.loader">View</a></div>
      `;
      newModCard.innerHTML = newModCardHTML;

      modsContainer.insertBefore(newModCard, modsContainer.firstChild); 
      geodeCardCreated = true;
    }

    
    function removeGeodeCard() {
      var geodeCard = modsContainer.querySelector('.mod-card[data-name="Geode"]');
      if (geodeCard) {
        modsContainer.removeChild(geodeCard);
        geodeCardCreated = false;
      }
    }

  
    searchInput.value = '';
    createGeodeCard();
  })
  .catch(error => {
    console.error('Error fetching mods:', error);
  });


document.addEventListener('click', function(event) {
  if (event.target && event.target.matches('.mod-card .buttons a')) {
    event.preventDefault(); 
    var link = event.target;
    var modUrl = link.getAttribute('href'); 
    var nname = link.parentElement.parentElement.querySelector('h1').textContent.trim(); 
    localStorage.setItem('realname', nname); 
    var modVersion = link.parentElement.parentElement.querySelector('.version').textContent.trim(); 
    localStorage.setItem('modVersion', modVersion); 
    window.location.href = 'view.html?url=' + encodeURIComponent(modUrl); 
  }
});
