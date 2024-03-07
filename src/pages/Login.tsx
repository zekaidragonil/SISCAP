import { IonAlert, 
  IonButton, 
  IonCard,
  IonCardContent, 
  IonCardHeader,
  IonCardSubtitle, 
  IonCardTitle,
  IonCol,
  IonContent, 
  IonFooter, 
  IonImg, 
  IonInput, 
  IonItem, 
  IonList,
  IonLoading, 
  IonPage,
  IonRouterLink,
  IonRow } from '@ionic/react';
  import { useState } from 'react';
  import './Page.css';
  import {loginUser } from '../firebaseConfig/firebase'
  import { useHistory } from 'react-router-dom';

  
  
  
  const Login: React.FC = () => {
    const history = useHistory();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [mostrarAlerta, setMostrarAlerta] = useState(false);
      const [busy, setBusy] = useState<boolean>(false);
      const [titulo, setTitulo] = useState('');
      const [mensaje, setMensaje] = useState('');
  
    
  
   async function handleLogin (){
        //condicion que comprueba si los campos esta vacios      
       if (email.trim() === '' || password === '') {
            setMostrarAlerta(true);
            setTitulo('Error!!');
            setMensaje('Los campos no puede ir vacios, porfavor verifiquelos o intente nueva mente  ');
           
           }else{
              
             try {
               setBusy(true);
               const rol = await loginUser(email, password);
                 
                 if (rol) {
                 if (rol === 'Administrador') {
                   history.push('/dashboard');
                 } else if (rol === 'Gerente') {
                   history.push('/dashboard-gerente');
                 } else if(rol === 'Usuario') {
                   history.push('/dashboard-plant');
                 }else if( rol === 'UTA'){
                  history.push('/dashboardUTa')
               } else {
                setMostrarAlerta(true);
                setTitulo('Error!!');
                setMensaje('No se pudo iniciar sesión, verifique los datos ingresados e intente nuevamente.');
               
               }
               }
             } catch (error) {
               console.log(error);
             //setMsj('Ocurrió un error al iniciar sesión. Por favor, inténtelo nuevamente.');
            // setShowToast(true);
           
             } finally {
               setBusy(false);
             }
           }
  
    } 
          
       return(
          <IonPage>
           <IonLoading message={'Por favor espere...'} duration={0} isOpen={busy}  />
          <IonContent fullscreen className='ion-padding'>
          <IonImg src="./assets/img/minaguas_black.png" className='imgLogin'></IonImg>
           <IonCard className='login'>
             <IonCardHeader>
              <IonCardTitle class='ion-text-center'>Iniciar Sesión</IonCardTitle>
              <IonCardSubtitle class='ion-text-center'>Complete sus datos para ingresar</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines='none'>
                 <IonItem>
                  <IonInput label="Correo" label-placement="stacked" type='email' placeholder='ejemplo@rdev.com' onInput={(e: any) => setEmail(e.target.value)}></IonInput>
                   </IonItem>
                   <IonItem>
                   <IonInput label="Contraseña" label-placement="stacked" type='password' placeholder='***********'onInput={(e: any) => setPassword(e.target.value)} ></IonInput>
                   </IonItem>
                </IonList>
                 <IonRow className="ion-text-center ion-justify-content-center">
                  <IonCol size="12">
                    <p>Olvidaste tu contraseña?
                      <IonRouterLink className="custom-link" routerLink={'/reset_password'}> {'Recuperar'} &rarr;</IonRouterLink>
                    </p>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>
            <IonButton  onClick={handleLogin} className="btnLogin" expand="block">Ingresar</IonButton> 
            <IonAlert isOpen={mostrarAlerta}  onDidDismiss={() => setMostrarAlerta(false)} header={titulo}  message={mensaje} buttons={['OK']} ></IonAlert> 
           </IonContent>
           <IonFooter>
             <IonRow className="ion-text-center ion-justify-content-center">
              <IonCol size="12">
                <small className='ion-no-margin ion-padding'>Desarrollado por la Dirección de Sistemas y Desarrollo de Tecnologias MINAGUAS ©2023, todos los derechos reservados.</small>
              </IonCol>
            </IonRow>
          </IonFooter>
        </IonPage>
       )
  }
  
  export default Login