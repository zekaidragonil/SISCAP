import React, { useState, useEffect } from 'react';
import { createOutline, personAddSharp } from 'ionicons/icons';
import { IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { auth , db } from '../firebaseConfig/firebase';
import {  getDocs, collection} from 'firebase/firestore';

const Users: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const Datos =  async () =>{
 const user = auth.currentUser;
          if(user){
    const UserDoc = collection(db, 'Users');
    const querySnapshot = await getDocs(UserDoc);

    const userDataArray:any = []; 
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        userDataArray.push(userData);
       
        });
        setUsers(userDataArray) 
       }          
      }
      Datos();
  }, []);


  const handleSearchChange = (e: CustomEvent) => {
    const term = e.detail.value;
    setSearchTerm(term || '');
  };

 
  const filteredUsers = users.filter(plant => {
    const regex = new RegExp(searchTerm, 'i');
    return regex.test(plant.name) || plant.name.toLowerCase().startsWith(searchTerm.toLowerCase());
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Usuarios</IonTitle>
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
          {filteredUsers.map((user, index) => (
            <IonItem key={index} routerLink={`/edit_user/${user['uid']}`} button detail={true} detailIcon={createOutline}>
              <IonLabel>
                <h3>{user['name']} - {user['plant']}</h3>
                <p>{user['phone']} - {user['email']}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton routerLink='/add_users'>
            <IonIcon icon={personAddSharp}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default Users;
