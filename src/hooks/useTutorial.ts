import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";

export const useTutorial = () => {
  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'Suivant',
      prevBtnText: 'Précédent',
      doneBtnText: 'Terminer',
      steps: [
        {
          element: '#mode-switcher',
          popover: {
            title: 'Sélecteur de Mode',
            description: 'Basculez entre la conversion de Texte vers Binaire ou de Binaire vers Texte.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#input-card',
          popover: {
            title: 'Zone de Saisie',
            description: 'Entrez votre texte ou votre code binaire ici. La conversion se fait en temps réel.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#output-card',
          popover: {
            title: 'Résultat de la Conversion',
            description: 'Le résultat traduit s\'affiche instantanément ici. Vous pouvez le copier en un clic.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#presets-bar',
          popover: {
            title: 'Exemples Prédéfinis',
            description: 'Utilisez ces boutons pour charger rapidement des exemples et explorer l\'outil.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#byte-matrix',
          popover: {
            title: 'Matrice d\'Octets',
            description: 'Chaque caractère est décomposé en octet. Cliquez sur un bloc pour l\'éditer spécifiquement.',
            side: "top",
            align: 'start'
          }
        },
        {
          element: '#interactive-byte-builder',
          popover: {
            title: 'Simulateur Tactile',
            description: 'Manipulez les bits individuels de l\'octet sélectionné pour voir l\'impact sur le caractère.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '#binary-stats-panel',
          popover: {
            title: 'Analyse du Signal',
            description: 'Visualisez les statistiques de votre message : nombre de caractères, d\'octets et de bits.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '#start-tutorial-btn',
          popover: {
            title: 'Besoin d\'aide ?',
            description: 'Vous pouvez relancer ce tutoriel à tout moment en cliquant sur ce bouton Aide.',
            side: "bottom",
            align: 'end'
          }
        },
      ]
    });

    driverObj.drive();
  };

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setTimeout(() => {
        startTutorial();
        localStorage.setItem('hasSeenTutorial', 'true');
      }, 1000);
    }
  }, []);

  return { startTutorial };
};
