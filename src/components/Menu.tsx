import {
  IonBadge,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { homeOutline, homeSharp, bookmarkOutline, businessOutline, businessSharp, peopleOutline, peopleSharp, logOutOutline, notificationsOutline, notificationsSharp} from 'ionicons/icons';
import './Menu.css';
import { useEffect, useState } from 'react';
import {getCurrentUser, auth, logoutUser} from '../firebaseConfig/firebase'
import { useHistory } from 'react-router-dom';
import {datoPlantas } from '../pages/helper'


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  requiredRole: string[];
}


 
const appPages: AppPage[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    iosIcon: homeOutline,
    mdIcon: homeSharp,
    requiredRole: [ 'Administrador']
  },
  {
    title: 'Plantas',
    url: '/busqueda',
    iosIcon: businessOutline,
    mdIcon: businessSharp,
    requiredRole: [ 'Administrador']
  },
 

  {
    title: 'Usuarios',
    url: '/User',
    iosIcon: peopleOutline,
    mdIcon: peopleSharp,
    requiredRole: ['Administrador']
  }
]




const Menu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [busy, setBusy] = useState<boolean>(false)
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);


  
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getCurrentUser();
       const email = auth.currentUser?.email;
       setEmail(email as string)
       setRole(role as string);
         
       let Cantidad = 0
       const Report = await datoPlantas();
       const solicitud = Report.forEach(element => {
         if(element.reportes){
          const repoteEncontrado = Object.values(element.reportes)
         const condicion =  repoteEncontrado.filter((item) => item.estatus === 'solicitud')
          Cantidad = condicion.length
         }
       });
        
       setNotificationCount(Cantidad)
    }
    fetchUserRole();
  },[location])



  function logout() {
    setBusy(true)
    logoutUser()
    setBusy(false)
    window.location.reload()
  }
  
  const filteredAppPages = appPages.filter(appPage => {
    if (role === 'Administrador') {
      return appPage.title !== 'Panel' && appPage.title !== 'hidrologica';
     
    }
    if (role === 'Gerente') {
      return appPage.title !== 'Usuarios' && appPage.title !== 'Inventario' && appPage.title !== 'Dashboard' && appPage.title !== 'Plantas';
    }
    return appPage.requiredRole && appPage.requiredRole.includes(role);
  });



 
  return (
    <IonMenu contentId="main" type="push">
      <IonLoading message={'Cerrando sesión'} duration={0} isOpen={busy} />
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{role}</IonListHeader>
          <IonNote>{email}</IonNote>
          {filteredAppPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          {role === 'Administrador' && (
            <IonMenuToggle key={'solicitudes'} autoHide={false}>
              <IonItem className={location.pathname === '/solicitudes' ? 'selected' : ''} routerLink={'/solicitudes'} routerDirection="none" lines="none" detail={false}>
                <IonIcon aria-hidden="true" slot="start" ios={notificationsOutline} md={notificationsSharp} />
                <IonLabel>Reporte </IonLabel>
                {notificationCount > 0 ? <IonBadge color="tertiary" >{notificationCount}</IonBadge> : null}
              </IonItem>
            </IonMenuToggle>
          )}
        </IonList>
        <IonList>
          <IonItem lines="none" onClick={logout}>
            <IonIcon aria-hidden="true" slot="start" icon={logOutOutline} />
            <IonLabel>Cerrar sesión</IonLabel>
          </IonItem>
        </IonList>
    </IonContent>
  </IonMenu>
  )};

export default Menu;
