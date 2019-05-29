# Test technique JavaScript


## Spécifications

Le but est de consommer l'api de ​http://fixer.io​ (l'obtention d'un API KEY est gratuite), pour
construire un convertisseur de devise en temps réel.

## Résultat attendu

```
● Une application permettant de renseigner dans un champ de saisie une somme en
euros, et d'avoir la conversion dans une autre devise. Une liste déroulante permet de
sélectionner la devise dans laquelle la somme en euros doit être convertie.
● Le calcul doit être instantané : dès que le montant en euros change ou que la devise
sélectionnée change, le montant converti doit changer.
● L'utilisation de libraries (React, jQuery...) et autres modules de l'écosystème est
autorisée.
● Pas de charte graphique imposée, mais c'est l'occasion de montrer que tu es
capable de développer un truc propre :)
```

## Livraison

Le code doit être pushé sur un repo public sur GitHub.

## Implémentation

Un objet javascript "fixerIoEuroConverter" gère la consommation du service fixer.io

Son constructeur définit les paramètres nécessaires à la consommation du service.

Il y a 3 méthodes:
```
● init: récupèrte la liste des devises disponibles pour remplir la liste de sélection,
● convert: consomme la fonction "convert" de fixer.io. Celle fonctionnalité n'est manifestement pas ou plus gratuite, dans ce cas on appelle la méthode suivante,
● convertCallback: consomme la fonction "latest" pour récupérer le dernier taux de change connu de la devise demandée et applique le calcul de la conversion
```

Il y a 2 fonctions génériques qui gèrent l'affichage des résultats.

Le tout s'appuie sur Jquery 3.4.1. 

La page index.html appelle l'objet.

Le service est consommé à l'initialisation une fois page complètement chargée, au moment de changer ou lorsque qu'une touche du clavier est relâchée sur le champs de saisie du montant
et lorsqu'une autre valeur de la liste des devises est choisie.


