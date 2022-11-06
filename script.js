var container=document.getElementsByClassName('container')[0]

var resultContainer=document.getElementById('ResultContainer')

document.getElementById('submit').addEventListener('click',showResults);
var apiKey="a5dbd364b8009e0efd6013a0dabbd1e9"
var city1LatLong,city2LatLong
var nbrMaxOfMosques=20
var listOfImages=[]
for(i=0;i<nbrMaxOfMosques*5;i++)
fetch("https://source.unsplash.com/1600x900/?mosque").then(r=>addImages(r))

function addImages(result){
    listOfImages.push(result.url)
}

function callMosquesApi()
{
    if(city1LatLong!=undefined && city2LatLong!=undefined)
   {
    url='https://api.opentripmap.com/0.1/ru/places/bbox?lon_min='+city1LatLong[1]+'&lat_min='+city1LatLong[0]+'&lon_max='+city2LatLong[1]+'&lat_max='+city2LatLong[0]+'&kinds=mosques&format=geojson&apikey=5ae2e3f221c38a28845f05b642e507377e5261594474e70db33f4cf4'

    fetch(url).then(r=>r.json()).then(x=>FindMosques(x))
   } 
   
}
var mosque=[]
var xid=[]
mosqueIndex=0;
function FindMosques(result)
{
  index=0
for(i in result.features)
{
    var name=result.features[i].properties.name;
    var rate=result.features[i].properties.rate;
    if(rate=='0')
    rate='3'
    var kinds=result.features[i].properties.kinds;
     xid.push(result.features[i].properties.xid);
    if(index<listOfImages.length)
    var image=listOfImages[index]
    index++
   
    var osm=result.features[i].properties.osm;
    var localisationLink="https://www.openstreetmap.org/"+osm
   
     mosque.push('<div><img src="'+image+'" alt=""><p class="description">'+kinds+'.</p></div><p class="localisation"><a href="'+localisationLink+'">Voir La localisation Ici</a></p><p>'+rate+'</p>')
    
}

for(id in xid){
    url="https://api.opentripmap.com/0.1/ru/places/xid/"+xid[id]+"?apikey=5ae2e3f221c38a28845f05b642e507377e5261594474e70db33f4cf4"
    fetch(url).then(r=>r.json()).then(r=>getMosqueDetails(r))
}

}
function randomInRange(start,end){
    return Math.floor(Math.random() * (end - start + 1) + start);
}
function getMosqueDetails(result)
{
    mosqueIndex++;
   
var newName=result.name;
if(newName==undefined||newName.length==0)
newName='مسجد'
var city=result.address.city;
city=city==undefined?"":city
var city_district=result.address.city_district;
city_district=city_district==undefined?"":city_district
var country=result.address.country;
country=country== undefined?"":country
var county=result.address.county;
county= county==undefined?"":county
var region=result.address.region;
region=region== undefined?"":region
var state_district=result.address.state_district;
state_district=state_district== undefined?"":state_district
var suburb=result.address.suburb;
suburb=suburb== undefined?"":suburb
var latMosque=result.point.lat;
latMosque=latMosque== undefined?"":latMosque
var lonMosque=result.point.lon;
lonMosque=lonMosque== undefined?"":lonMosque
var nameDetails='<div class="mosque"> <h2>'+newName+'</h2>'
var details='<p><b>Ville</b>'+city+'</p>'+'<p><b>city_district :</b>'+city_district+'</p>'+'<p><b>Pays</b> :'+country+'</p>'+'<p><b>County</b>:'+county+'</p>'+'<p><b>Region :</b>'+region+'</p>'+'<p><b>state_district :</b>'+state_district+'</p>'+'<p><b>suburb :</b>'+suburb+'</p>'+'<p><b>coordonnées géographique </b> <br> <b><i>lat<i>:</b>'+latMosque+'</p>'+'<p><b><i>lat<i>:</b>'+lonMosque+'</p></div>'
var idDivMap="googleMap"+mosqueIndex
var divMap='<div id="'+idDivMap+'" style="width:100%;height:400px;"></div>'
var mosqueParentHtml=document.getElementById("ResultContainer");
if(mosqueIndex<mosque.length)
{
    mosqueParentHtml.innerHTML+=nameDetails+mosque[mosqueIndex]+details
  
}

}

function myMap(lat,lon,id) {
    var mapProp= {
      center:new google.maps.LatLng(lat,lon),
      zoom:5,
    };
    var map = new google.maps.Map(document.getElementById(id),mapProp);
}
var callApi=true;
function showResults()
{
    if(callApi)
    cityToLatLongApi()
 
container.style.display='none';
resultContainer.style.visibility="visible"
callMosquesApi()
}
function cityToLatLongApi()
{
    var city1=document.getElementById("city1").value.trim();
    var city2=document.getElementById("city2").value.trim();
    
    var url="http://api.openweathermap.org/geo/1.0/direct?q="+city1+"&limit=5&appid="+apiKey
fetch(url).then(r=>r.json()).then(x=>getLatLongCity1(x))
url="http://api.openweathermap.org/geo/1.0/direct?q="+city2+"&limit=5&appid="+apiKey
fetch(url).then(r=>r.json()).then(x=>getLatLongCity2(x))

}
function getLatLongCity1(result)
{
    callApi=false;

    city1LatLong=[result[0].lat,result[0].lon]
    showResults()
}
function getLatLongCity2(result)
{
    callApi=false;
    city2LatLong=[result[0].lat,result[0].lon]
showResults()
}