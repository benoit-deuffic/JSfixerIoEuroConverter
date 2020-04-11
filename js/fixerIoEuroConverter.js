/* fixerIoEuroConverter 
*
*  Classe Javascript qui consomme le service fixer.io
*  pour convertir des euros dans la devise choisie
*
*  @author : Benoît DEUFFIC <benoit+oclock@deuffic.fr>
*
*  pour le débogage et la formation on utilise toujours console.log() à chaque étape importante du programme
*/


/* fixerIoEuroConverter 
* Constructeur 
* Pas de paramètres en entrée
* fixe les variables de base nécessaires à la consommation du service 
*/

function fixerIoEuroConverter (params) {

   /* paramètre url de base du service */
   this.baseUrl = params['baseUrl'];

  /* clé d'api fournie à l'inscription au service */
   this.apiKey = '412e09694588a610eee73b014122cb69';

   /* points d'entrée pour consommer les fonctions */
   this.listCurEndpoint = params['currencyEndpoint'];
   this.convertEndpoint = params['convertEndpoint'];

   /* message générique si le service est indisponible quelque'en soit la raison */
   this.unavailableMessage = 'This service is unavailable. Please try later.';
   this.targets = params.targets;

}

/* fixerIoEuroConverter.init
*  méthode pour initialiser la page avec la liste des devises
*  tel que spécifié ici : https://fixer.io/documentation#supportedsymbols  
*
*  en entrée: (string) identifiant du composant select qui doit recevoir les options
*  en sortie: si réponse ok : remplie les options de la liste avec les identifiants et noms des devises retournées par le service
*             si réponse ko : remplie l'élément dédié à l'affichage des erreurs retournées par le services
*/

fixerIoEuroConverter.prototype.init = function ( )
{
        var serviceLocation = this.baseUrl + this.listCurEndpoint;

                                              /* ici on a aussi la possibilité de construire les paramètres d'URL avec $.params(), très utile lorsqu'y il y a beaucoup
                                              * de paramètres à gérer
                                              * http://api.jquery.com/jquery.param/ 
                                              */
        var urlWithParams = serviceLocation + '?access_key=' +  this.apiKey;

        console.log('Querying: ' + urlWithParams + '...');

        $.ajax({
            context: this,
            url: urlWithParams, 
            type: 'GET',
            crossDomain: true,  
            jsonp: false,
            dataType: 'json',
            success: function (data) {
               console.log(data);
               /* testons si le service a répondu 'success=true' tel que spécifié dans la doc du service 
               *  là c'est ok, on fait le traitement
               */
               if ( data.success === true ) {
 
                  /* le service a répondu, récupérons nos résultats tel que spécifié dans la doc du service. */
                  var results = data.symbols;

                  /* ici on parcourt la collection d'obbets retournés par le service en récupérant le couple clé-valeur des devises
                  *  et on remplie nos options sous la forme de texte html ( plus performant que de manipuler DOM )
                  */

                  for (let [key, value] of Object.entries(results)) {
                       this.targets.list.append("<option value='" + key + "'>" + value + "</option>\n");
                     }
               }

               /* si non, on affiche le message d'erreur qui est retourné par le service */
               else {

                    displayError ( this.targets.error, data.error.info );                  

                }
            },

            /* dans le cas de fixer.io, le service retourne toujours un code http 200, l'erreur étant indiquée dans le contenu de la réponse
            *  par contre c'est utile si jamais le service est indisponible ( code http différent de 200) et on affiche une erreur générique
            *  "service indisponible" quelqu'en soit la raison
            */  
            error: function (data) {
               console.log( data );

                    displayError ( this.targets.error, this.unavailableMessage );                  

            }

          });
};

/* fixerIoEuroConverter.convert
*  méthode de conversion de la somme saisie en euros dans la devise choisie 
*  tel que spécifié ici : https://fixer.io/documentation#convertcurrency 
*  !! Ne fonctionne que si on a souscrit une license payante !!
*  --> sinon on va utiliser une autre méthode basée sur les derniers taux connus
*
*  en entrée: (string) amount : la somme saisie dans le champ texte
*             (string) currency :  l'identifiant de 3 lettres de la devise choisie dans la liste déroulante
*
*  en sortie: si amount est vide ou nul, ne fait rien
*             si ok, affiche le résultat de la conversion
*             si ko, affiche le message d'erreur du service et retourne faux
*/

fixerIoEuroConverter.prototype.convert = function ( amount, currency )
{
        /* ne faisons rien si la valeur amount est nulle ou vide */
        if ( !amount || 0 === amount.length ) { return ; }   

        /* réinitialisons le champs d'erreur */
        $( "#error" ).hide();

        var serviceLocation = this.baseUrl + this.convertEndpoint;

                                              /* ici on a aussi la possibilité de construire les paramètres d'URL avec $.params(), très utile lorsqu'y il y a beaucoup
                                              * de paramètres à gérer
                                              * http://api.jquery.com/jquery.param/ 
                                              */
        var urlWithParams = serviceLocation + '?access_key=' +  this.apiKey 
                                            + '&from=EUR'
                                            + '&to=' + currency
                                            + '&amount=' + amount;


        console.log('Querying: ' + urlWithParams + '...');

        $.ajax({
            context: this,
            url: urlWithParams, 
            type: 'GET',
            crossDomain: true, 
            jsonp: false,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if ( data.success === true ) {
 
                   /* on récupère notre montant converti dans la devise choisie */
                   var conversionAmount = data.result;
                   /* on récupère la devise choisie dans la requête*/
                   var choosedCurrency = data.query.to;

                   displayResult(this.targets.success, conversionAmount + ' ' + choosedCurrency);
                }
                else {

                    displayError ( this.targets.error, data.error.info );                  

                }
            },
            /* dans le cas de fixer.io, le service retourne toujours un code http 200, l'erreur étant indiquée dans le contenu de la réponse
            *  par contre c'est utile si jamais le service est indisponible ( code http différent de 200) et on affiche une erreur générique
            *  "service indisponible" quelqu'en soit la raison
            */
            error: function (data) {
               console.log( data );

                    displayError ( this.targets.error, that.unavailableMessage );

           }
          });
};


/* displayError
*  fonction générique qui gère l'affichage des messages d'erreur retournés par le service
*  évite la répétition du même code un peu partout dans le programme.
*  en entrée : (string) message d'erreur
*  en sortie : remplie l'élément erreur
*/

function displayError ( target, message ) {

  target.empty();
  target.append( message );
  target.show();

};

/* displayResult
*  fonction générique qui gère l'affichage du résultat retourné par le service
*  évite la répétition du même code un peu partout dans le programme.
*  en entrée : (string) valeur du résultat
*  en sortie : remplie l'élément du résultat
*/

function displayResult (target, value ) {

  target.empty();
  target.append( value );


}

/* hideFields
*  fonction générique qui cache nos champs de résultats
*/

function hideFields(targets) {

  targets.success.empty();
  targets.error.hide();

}
