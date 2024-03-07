import { IonApp, IonRouterOutlet, IonSpinner, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch  } from 'react-router-dom';
import {useEffect, useState } from 'react'
import {getCurrentUser} from './firebaseConfig/firebase'
import Menu from './components/Menu';
import Login from './pages/login';
import UsuarioDashboard from './mobile/dashboardUser'
import Inventario from './mobile/inventario'
import dashboard from './pages/dashboard'
import Produccion from './mobile/produccion'
import Reporte from './mobile/Alerta'
import Alerta from './mobile/Alerta'
import Gerente from './pages/dashboardGerente';
import showPlant from './pages/showPlant';
import BusquedaPlant from './pages/BusquedaPlant';
import Users from './pages/User';
import Editar from './pages/EditUsers';
import AddUsers from './pages/addUser';
import EstadosMapa from './pages/EstadosMapa'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Solicitudes from './pages/Solicitudes';
import ShowReport from './pages/showReport';
import Update from './pages/UpdateProducion';
import UTA from './pages/Uta';

setupIonicReact();

const RoutingSystem: React.FC = () => {
  return (
    <IonReactRouter>
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
        <Switch>
          <Route path="/dashboard-plant" component={UsuarioDashboard} exact/>
          <Route path="/dashboard-gerente" component={Gerente} exact/>
          <Route path="/inventario/:id" component={Inventario} exact/> 
          <Route path="/dashboard" component={dashboard} exact/>
          <Route path="/produccion/:id" component={Produccion} exact/>
          <Route path="/reporte/:id" component={Reporte} exact/>
          <Route path="/alert/:id" component={Alerta} exact/>
          <Route path="/showplant/:id" component={showPlant} exact/>
          <Route path="/busqueda" component={BusquedaPlant} exact/>
          <Route path="/User" component={Users} exact/>
          <Route path="/edit_user/:id" component={Editar} exact/>
          <Route path="/add_users" component={AddUsers} exact/>
          <Route path="/mapa_estado/:id" component={EstadosMapa} exact/>
          <Route path="/solicitudes" component={Solicitudes} exact/>
          <Route path="/showreport/:id" component={ShowReport} exact/>
          <Route path="/update_produccion/:id" component={Update} exact/>
          <Route path="/dashboardUTa" component={UTA} exact/>

           </Switch>
        </IonRouterOutlet>

      </IonSplitPane>
      <Route path="/login" component={Login} exact/>
      <Route path="/reset_password"  exact/>
    </IonReactRouter>
  )
}

const App: React.FC = () => {
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    getCurrentUser().then(rol => {
      if (rol === 'Administrador') {
       window.history.replaceState({}, '', '/dashboard')
      }else if(rol === 'Usuario'){
        window.history.replaceState({},'', '/dashboard-plant' )
      } else if(rol === 'Gerente'){
       window.history.replaceState({},'', '/dashboard-gerente' )
      }else if(rol === 'UTA'){
        window.history.replaceState({},'', '/dashboardUTa' )
     } else{
      window.history.replaceState({}, '', '/login')
     }
      setBusy(false)
    })
  }, [])

  return (
    <IonApp>
      {busy ? <IonSpinner name='dots' className='loading'/> : <RoutingSystem />}
    </IonApp>
  )
}

export default App
