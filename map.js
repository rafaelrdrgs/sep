var map;
  var marker;
  var markers = []; // Array para armazenar todos os marcadores
  var radius = 12; // Raio em km para exibir pontos próximos

  // Função que inicializa o mapa com localização padrão em Porto Alegre
  function initMap() {
    var portoAlegre = { lat: -30.0346, lng: -51.2177 };

    // Inicializa o mapa centralizado em Porto Alegre
    map = new google.maps.Map(document.getElementById('map'), {
      center: portoAlegre,
      zoom: 12,
      styles: [ /* insira aqui seus estilos de mapa customizados se quiser */ ]
    });

    // Carregar marcadores do CMS dinamicamente
    addCmsMarkers();

    // Aplica a clusterização aos marcadores
    const markerCluster = new MarkerClusterer({
      map: map,
      markers: markers,
      renderer: {
        styles: [
          {
            textColor: "white",
            url: "https://cdn.prod.website-files.com/66cc84ae5ae8113288f88954/6717a96cdf3b308245e229f9_location-pin.svg", // Imagem personalizada do cluster
            height: 50,
            width: 50,
            textSize: 16 // Tamanho do texto dentro do cluster
          }
        ]
      }
    });
  }

  // Função para adicionar os marcadores dinâmicos do CMS e exibir na lista
  function addCmsMarkers() {
    var cmsItems = document.querySelectorAll('.cms-item'); // Classe dos itens do CMS
    var pointList = document.getElementById('point-list'); // Elemento da lista de pontos

    cmsItems.forEach(function(item) {
      var lat = parseFloat(item.getAttribute('data-lat'));
      var lng = parseFloat(item.getAttribute('data-lng'));
      var title = item.getAttribute('data-title');
      var address = item.getAttribute('data-address'); // Assumindo que você tem o endereço no CMS

      // Cria o marcador personalizado para cada ponto
      var cmsMarker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: title,
        icon: {
          url: "https://cdn.prod.website-files.com/66cc84ae5ae8113288f88954/6717a96cdf3b308245e229f9_location-pin.svg", // Caminho do ícone personalizado
          scaledSize: new google.maps.Size(42, 40) // Tamanho do ícone
        }
      });

      // Adiciona o marcador ao array de marcadores
      markers.push(cmsMarker);
    });
  }

  // Função para calcular a distância entre dois pontos (fórmula de Haversine)
  function calculateDistance(lat1, lng1, lat2, lng2) {
    var R = 6371; // Raio da Terra em km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  }

  // Função para filtrar e mostrar os pontos próximos ao usuário
  function filterNearbyPoints(userLocation) {
    markers.forEach(function(cmsMarker) {
      var markerPosition = cmsMarker.getPosition();
      var distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        markerPosition.lat(), markerPosition.lng()
      );

      // Exibir marcadores dentro do raio definido
      if (distance <= radius) {
        cmsMarker.setMap(map); // Exibe o marcador
      } else {
        cmsMarker.setMap(null); // Oculta o marcador fora do raio
      }
    });
  }

  // Função para obter a localização atual do usuário e mostrar pontos próximos
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Centraliza o mapa na posição do usuário
        map.setCenter(userLocation);
        map.setZoom(14);

        // Adiciona um novo marcador na localização do usuário
        marker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Você está aqui",
          icon: {
            url: "https://cdn.prod.website-files.com/66cc84ae5ae8113288f88954/6717b1e42d2f3b7d9108f2c7_user-point.svg", // Ícone personalizado para o usuário
            scaledSize: new google.maps.Size(24, 24)
          }
        });

        // Filtra e exibe os pontos próximos
        filterNearbyPoints(userLocation);
      }, function() {
        alert("Erro ao obter sua localização. Porto Alegre continuará como localização padrão.");
      });
    } else {
      alert("Geolocation não é suportado pelo seu navegador.");
    }
  }

  // Listener para o botão de "Permitir Localização"
  document.getElementById('permitir-localizacao').addEventListener('click', function() {
    getUserLocation();
  });

  // Adiciona o item à lista de pontos
  var listItem = document.createElement('div');
  listItem.className = 'list-item';
  listItem.innerHTML = `
    <h3>{{wf {&quot;path&quot;:&quot;nome-do-local&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</h3>
    <p>{{wf {&quot;path&quot;:&quot;endereco-completo&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</p>
    <a href="https://www.google.com/maps/dir/?api=1&destination={{wf {&quot;path&quot;:&quot;latitude&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }},{{wf {&quot;path&quot;:&quot;longitude&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}" target="_blank">Como chegar</a>
  `;
  document.getElementById('point-list').appendChild(listItem);

  // Evento ao clicar no item da lista para centralizar o marcador
  listItem.addEventListener('click', function() {
    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(15);
    openCustomInfoWindow(cmsMarker, title, address, lat, lng);
  });

  // Evento ao clicar no marcador para abrir o InfoWindow personalizado
  cmsMarker.addListener('click', function() {
    openCustomInfoWindow(cmsMarker, title, address, lat, lng);
  });

// Função para abrir um InfoWindow personalizado para o marcador
function openCustomInfoWindow(marker, title, address, lat, lng) {
var contentString = `
  <div class="info-window">
    <div class="info-window-content">
      <h3>{{wf {&quot;path&quot;:&quot;nome-do-local&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</h3>
      <p>{{wf {&quot;path&quot;:&quot;endereco-completo&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</p>
      <a href="https://www.google.com/maps/dir/?api=1&destination={{wf {&quot;path&quot;:&quot;latitude&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }},{{wf {&quot;path&quot;:&quot;longitude&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}" target="_blank">Como chegar <span>→</span></a>
      <button class="info-window-close" onclick="closeInfoWindow()">×</button>
    </div>
  </div>
`;

var infoWindow = new google.maps.InfoWindow({
  content: contentString,
  maxWidth: 250
});

// Abre o InfoWindow no mapa
infoWindow.open(map, marker);

// Fecha o InfoWindow ao clicar no botão de fechar
google.maps.event.addListener(infoWindow, 'domready', function() {
  document.querySelector('.info-window-close').addEventListener('click', function() {
    infoWindow.close();
  });
});
}