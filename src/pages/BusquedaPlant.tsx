import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonFab,  IonSearchbar, IonBackButton } from '@ionic/react';
import './Page.css';
import React, { useState, useEffect } from 'react';
import { eyeOutline } from 'ionicons/icons';
import { datoPlantas } from '../pages/helper';

const BusquedaPlant: React.FC = () => {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataUpdated, setDataUpdated] = useState(false);
  useEffect(() => {
    const PlantaEncontrada = async () =>{
        const plantas = await datoPlantas();  
        setPlants(plantas);
        setDataUpdated(true);
    } 
    if (!dataUpdated) {
        // Solo cargar datos si aún no se han cargado
        PlantaEncontrada();
      }
  }, []);

  const handleSearchChange = (e: CustomEvent) => {
    const term = e.detail.value;
    setSearchTerm(term || '');
  };

  const filteredPlants = plants.filter(plant => {
    const regex = new RegExp(searchTerm, 'i');
    return regex.test(plant.name) || plant.name.toLowerCase().startsWith(searchTerm.toLowerCase());
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
          <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Plantas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonToolbar>
        <IonSearchbar
          placeholder='Buscar'
          value={searchTerm}
          onIonInput={handleSearchChange}
          
        ></IonSearchbar>
      </IonToolbar>
      <IonContent>
        <IonList>
          {filteredPlants.map(plant => (
            <IonItem key={`${plant.name}-${plant.codigo}`} routerLink={`/showplant/${plant.codigo}`} button detail={true} detailIcon={eyeOutline}>
              <IonLabel>
                <h3>{plant.name} <span>({plant.codigo})</span> </h3>
                <p>{plant.hidrologica}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
       
      </IonFab>
    </IonPage>
  );
};

export default BusquedaPlant;
