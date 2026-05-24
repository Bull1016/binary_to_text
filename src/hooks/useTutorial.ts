import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";

export const useTutorial = () => {
  const startTutorial = () => {
    const isMobile = window.innerWidth < 768;

    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'Suivant',
      prevBtnText: 'Précédent',
      doneBtnText: 'Terminer',
      stagePadding: 5,
      popoverClass: 'driverjs-theme',
      steps: [
        {
          element: '#mode-switcher',
          popover: {
            title: 'Sélecteur de Mode',
            description: 'Basculez entre la conversion de Texte vers Binaire ou de Binaire vers Texte.',
            side: isMobile ? "bottom" : "bottom",
            align: isMobile ? 'center' : 'start'
          }
        },
        {
          element: '#input-card',
          popover: {
            title: 'Zone de Saisie',
            description: 'Entrez votre texte ou votre code binaire ici. La conversion se fait en temps réel.',
            side: "bottom",
            align: isMobile ? 'center' : 'start'
          }
        },
        {
          element: '#output-card',
          popover: {
            title: 'Résultat de la Conversion',
            description: 'Le résultat traduit s\'affiche instantanément ici. Vous pouvez le copier en un clic.',
            side: "bottom",
            align: isMobile ? 'center' : 'start'
          }
        },
        {
          element: '#presets-bar',
          popover: {
            title: 'Exemples Prédéfinis',
            description: 'Utilisez ces boutons pour charger rapidement des exemples et explorer l\'outil.',
            side: "bottom",
            align: isMobile ? 'center' : 'start'
          }
        },
        {
          element: '#byte-matrix',
          popover: {
            title: 'Matrice d\'Octets',
            description: 'Chaque caractère est décomposé en octet. Cliquez sur un bloc pour l\'éditer spécifiquement.',
            side: "top",
            align: isMobile ? 'center' : 'start'
          }
        },
        {
          element: '#interactive-byte-builder',
          popover: {
            title: 'Simulateur Tactile',
            description: 'Manipulez les bits individuels de l\'octet sélectionné pour voir l\'impact sur le caractère.',
            side: isMobile ? "top" : "left",
            align: isMobile ? 'center' : 'start'
          }
        },
        {
          element: '#binary-stats-panel',
          popover: {
            title: 'Analyse du Signal',
            description: 'Visualisez les statistiques de votre message : nombre de caractères, d\'octets et de bits.',
            side: isMobile ? "top" : "left",
            align: isMobile ? 'center' : 'start'
          }
        },
        {
          element: '#start-tutorial-btn',
          popover: {
            title: 'Besoin d\'aide ?',
            description: 'Vous pouvez relancer ce tutoriel à tout moment en cliquant sur ce bouton Aide.',
            side: "bottom",
            align: isMobile ? 'center' : 'end'
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
