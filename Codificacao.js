var arena=document.getElementById("arena");
var menu=document.getElementById("menu");
var jogador=document.getElementById("jogador");
var qtdBombas=document.getElementById("oi");


var emJogo=false;
var posJogX=screen.width/2-25;
var posJogY=screen.availHeight/2-50;
var newJogX;
var newJogY;
var bombas;
var px=0;
var recarga=0;
var py=0;
var arenaX=screen.width;
var arenaY=screen.availHeight-75;
var totBombas=qtdBombas.innerHTML;
var vida=100;

menu.style.left=screen.width/2-200+"px";
menu.style.top=screen.availHeight/2-250+"px";
arena.style.height=screen.availHeight-75+"px";

function inicia(){
	emJogo=true;
	bombas=150;
	vida=100;
	tempLiberacao=0;
	px=0;
	py=0;
	vidaR.style.width=vida+"%";
	let i=0;
	while(i<tiros.length){
		arena.removeChild(tiros[i][0]);
		tiros.splice(i,1);
	}
	i=0;
	while(i<listExpl.length){
		arena.removeChild(listExpl[i][0]);
		i=i+1;
	}
	i=0;
	while(i<listBombas.length){
		arena.removeChild(listBombas[i][0]);
		i=i+1;
	}
	listBombas=[];
	tiros=[];
	newJogX=posJogX;
	newJogY=posJogY;
	jogador.style.left=newJogX+"px";
	jogador.style.top=newJogY+"px";
	arena.style.display="block";
	jogador.style.display="block";
	menu.style.display="none";
	qtdBombas.innerHTML=totBombas+" "+bombas;
	gameEngine();
}

var gameCall;
function gameEngine(){
	liberarBombas();
	engineJog();
	moveTiros();
	moveBombas();
	gerenciaExpl();
	testeColisao();
	recarga++;
	if(!emJogo) return;
	gameCall=requestAnimationFrame(gameEngine);
}

function moveJog(){
	var tecla=event.keyCode;
	if(tecla==65) px=-5;
	if(tecla==87) py=-5;
	if(tecla==68) px=5;
	if(tecla==83) py=5;
}
function paraJog(){
	var tecla=event.keyCode;
	if(tecla==65) px=0;
	if(tecla==87) py=0;
	if(tecla==68) px=0;
	if(tecla==83) py=0;
}

function engineJog(){
	newJogX=newJogX+px;
	newJogY=newJogY+py;
	if(newJogX<=0 || newJogX+50>=arenaX) newJogX=newJogX-px;
	if(newJogY<=0 || newJogY+50>=arenaY) newJogY=newJogY-py;
	jogador.style.top=newJogY+"px";
	jogador.style.left=newJogX+"px";
}

var tiros=[];
function jogAtira(){
	var tecla=event.keyCode;
	if(tecla==13 && recarga>=20){
		recarga=0;
		let tiro=document.createElement("div");
		arena.appendChild(tiro);
		tiro.setAttribute("class","tiro");
		tiro.style.left=newJogX+50/2-5+"px";
		tiro.style.top=newJogY-8+"px";
		let info=[tiro,newJogX+50/2-5,newJogY-8]
		tiros.push(info);
	}
}

function moveTiros(){
	for(var i=0;i<tiros.length;i++){
		tiros[i][2]=tiros[i][2]-10;
		tiros[i][0].style.top=tiros[i][2]+"px";
	}
}

var tempLiberacao=0;
var listBombas=[];
function liberarBombas(){
	tempLiberacao=tempLiberacao+1;
	if(tempLiberacao==150 && bombas>0){
		bombas=bombas-1;
		qtdBombas.innerHTML=totBombas+" "+bombas;
		if(bombas==0 && vida>0 && listBombas=="") fimJogo(0);
		tempLiberacao=0;
		let bombasArena=document.createElement("div");
		bombasArena.setAttribute("class","bomba");
		let randXbomba=Math.round(Math.random()*(arenaX-60)+30);
		bombasArena.style.left=randXbomba+"px";
		arena.appendChild(bombasArena);
		let info=[bombasArena,-80,randXbomba];
		listBombas.push(info);
	}
}

function moveBombas(){
	if(listBombas!=""){
		for(var i=0;i<listBombas.length;i++){
			listBombas[i][1]=listBombas[i][1]+2;
			listBombas[i][0].style.top=listBombas[i][1]+"px";
		}
	}
}

var createTemp=0;
var engineCreate;
var explosion;
var listExpl=[];
function vcreate(x,y){
	explosion=document.createElement("div");
	let atributos=document.createAttribute("style");
	atributos.value="top:"+(y+15)+"px;left:"+(x-25)+"px;width:70px;height:70px;background:url('Imagens/fireexplosion.png');background-size:cover;position:absolute";
	explosion.setAttributeNode(atributos);
	arena.appendChild(explosion);
	let info=[explosion,25];
	listExpl.push(info);
}

function gerenciaExpl(){
	for(var i=0;i<listExpl.length;i++){
		listExpl[i][1]=listExpl[i][1]-1;
		if(listExpl[i][1]==0){
			listExpl[i][0].remove();
			listExpl.shift();
		}
	}
}

function testeColisao(){
	for(var i=0;i<listBombas.length;i++){
		if(listBombas[i]){
			if(listBombas[i][1]+80>=arenaY){
				vcreate(listBombas[i][2],listBombas[i][1]);
				arena.removeChild(listBombas[i][0]);
				listBombas.shift();
				vida=vida-20;
				vidaR.style.width=vida+"%";
				i=i-1;
				if(vida==0) fimJogo(1);
				else if(listBombas=="" && bombas==0 && vida>0) fimJogo(0);
			}
			else if(newJogY<=listBombas[i][1]+80 && newJogY+50>=listBombas[i][1] && newJogX+50>=listBombas[i][2] && newJogX<=listBombas[i][2]+20) fimJogo(1);
		}
	}
	for(var i=0;i<tiros.length;i++){
		testeColisaoTiroBomba(i);
		if(tiros[i]){
			if(tiros[i][2]<=0){
				arena.removeChild(tiros[i][0]);
				tiros.splice(i,1);
				i=i-1;
			}
		}
	}
}

function tutorial(){
	alert("MOVER:\nW-A-S-D\n\nATIRAR:\nEnter");
}

function testeColisaoTiroBomba(indiceTiro){
	for(var i=0;i<listBombas.length;i++){
		if(listBombas[i] && tiros[indiceTiro]){
			if(tiros[indiceTiro][1]+20>=listBombas[i][2] && tiros[indiceTiro][1]<=listBombas[i][2]+20 && listBombas[i][1]+80>=tiros[indiceTiro][2]){
				vcreate(listBombas[i][2],listBombas[i][1]);
				arena.removeChild(tiros[indiceTiro][0]);
				arena.removeChild(listBombas[i][0]);
				tiros.splice(indiceTiro,1);
				listBombas.splice(i,1);
				i=i-1;
				if(bombas==0 && listBombas=="" && vida>0) fimJogo(0);
			}
		}
	}
}
	
function fimJogo(end){
	emJogo=false;
	arena.style.display="none";
	menu.style.display="block";
	if(end==1){
		document.getElementById("title").innerHTML="Derrota";
		menu.style.background="url('Imagens/fundoDerrota1.jpg')";
		document.getElementById("cmd_inicia").style.backgroundColor="red";
	}
	else{
		document.getElementById("title").innerHTML="Vitoria";
		menu.style.background="url('Imagens/terra-perfeito.jpg')";
		document.getElementById("cmd_inicia").style.backgroundColor="#0B0B61";
	}
	menu.style.backgroundSize="cover";
	jogador.style.display="none";
	cancelAnimationFrame(gameCall);
}
		
	
document.getElementById("cmd_dica").addEventListener("click",tutorial);
document.addEventListener("keydown",jogAtira);
document.addEventListener("keydown",moveJog);
document.addEventListener("keyup",paraJog);
document.getElementById("cmd_inicia").addEventListener("click",inicia);
