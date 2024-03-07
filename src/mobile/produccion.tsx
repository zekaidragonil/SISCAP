import { IonAlert, IonBackButton, IonButton, IonButtons,  IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonPage, IonRow, IonTextarea, IonTitle,  IonToolbar } from '@ionic/react';
import { db, auth } from '../firebaseConfig/firebase';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory  } from 'react-router-dom';
import { groupOne, groupTwo } from '../components/input'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { datoPlantas } from '../pages/helper';

const Produccion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [sulfatoType, setSulfatoType] = useState<string>(''); // Estado para almacenar el tipo de sulfato
  const [showTipoAlert, setShowTipoAlert] = useState(false); // Estado para mostrar/ocultar la primera alerta
  const [showGuardarAlert, setShowGuardarAlert] = useState(false)
  const [showCamposVaciosAlert, setShowCamposVaciosAlert] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [header, setheader] = useState('');
  const [mensaje, setMesaje] = useState('');
  const [Reporte, setReporte] = useState('');
  const [UltimaFecha, setFecha] = useState('');
  const history = useHistory();
  const [lastSaveDate, setLastSaveDate] = useState<string>('');
  

  useEffect(() => {


       const fecha = async () =>{
        const plantas = await datoPlantas();
        const plantaEncontrada: any = plantas.find((plant: any) => plant.codigo === id);
        const produccionValues = Object.values(plantaEncontrada.Produccion);
        const ultimosRegistros = produccionValues.slice(-1);
        
        ultimosRegistros.forEach((registro: any) => {
          setFecha(registro.fecha)
        })
      
      }
       fecha()


    // Obtener la fecha de la última vez que se guardó (puedes almacenarla en localStorage o en la base de datos)
    const savedDate = localStorage.getItem('lastSaveDate');
    if (savedDate) {
      setLastSaveDate(savedDate);
    }
  }, []);

  useEffect(() => {
    validateForm();
  }, [inputValues]);


   const  usuario = auth.currentUser

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value
    }));
  };
  const handleShowTipoAlert = () => {
    setShowTipoAlert(true); // Muestra la primera alerta para seleccionar el tipo
  };
  const handleTipoSulfatoSelected = (selectedType: string) => {
    setSulfatoType(selectedType); // Almacena el tipo de sulfato seleccionado en el estado
    setShowTipoAlert(false); // Cierra la primera alerta
    setShowGuardarAlert(true); // Muestra la segunda alerta de guardar
    
  };
  const validateForm = () => {
    const inputNames = [...groupOne, ...groupTwo].map((item) => item.name);
    const isFormValid = inputNames.every((name) => !!inputValues[name]);
    setIsFormValid(isFormValid);
  };

   const handleGuardar = async() => {
      

    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth();
    const ano = fechaActual.getFullYear();
    const fechaAlert = `${dia}/${mes}/${ano}`;
    
    if (UltimaFecha === fechaAlert) {
      // Muestra una alerta indicando que debe esperar un día para guardar de nuevo
      setheader('Error');
      setMesaje('Debes esperar un día completo para guardar de nuevo.');
      setShowCamposVaciosAlert(true);
      return;
    }

    if (!isFormValid) {
      // Muestra la alerta de campos vacíos
      setheader('Campos Vacíos');
      setMesaje('Por favor, complete todos los campos antes de guardar');
      setShowCamposVaciosAlert(true);
      return; // No procedas con el guardado si hay campos vacíos
    }

    const camposNegativos = Object.keys(inputValues).some((key) => {
      const value = parseFloat(inputValues[key]);
      return !isNaN(value) && value < 0;
    });
  
    if (camposNegativos) {
      setheader('Valores negativos');
      setMesaje('Los valores negativos no estan permitidos');
      setShowCamposVaciosAlert(true);
      return;   
    }

    // Limpia el formulario o realiza otras acciones necesarias
    const combinedInputValues: { [key: string]: string | Date } = {};   
    const sulfatoValue = inputValues['sulfato_aluminio_dosificado'];
    const esLiquido = sulfatoType === 'liquido';

   const parsedSulfatoValue = parseFloat(sulfatoValue);
   const valorFinalSulfato = isNaN(parsedSulfatoValue) ? '' : (esLiquido ? parsedSulfatoValue / 2 : parsedSulfatoValue);

    combinedInputValues['reporte'] = Reporte;

    [...groupOne, ...groupTwo].forEach((item) => {
      const value = inputValues[item.name] || '';
      combinedInputValues[item.name] = value;
    });
    combinedInputValues['sulfato_aluminio_dosificado'] = valorFinalSulfato.toString();
   

    // funcion de logica para guardar 
    const currentDate = new Date();
    const fecha = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`;
    combinedInputValues.fecha = fecha;
     combinedInputValues.key = uuidv4();
    // consulta al inventrio
    const InveRef = doc(db, 'Plants', id);
    const InventSnapshot = await getDoc(InveRef);
    
    if(InventSnapshot.exists()){
     const existingInventory = InventSnapshot.data().inventory || {};
     const cloroNumber = parseFloat(existingInventory.cloro);
     const sulfatoNumber = parseFloat(existingInventory.sulfato);
    

     if (!isNaN(cloroNumber) && !isNaN(sulfatoNumber)) {

      const cloroDosificado = parseFloat(combinedInputValues.cloro_dosificado);
      const sulfatoDosificado = parseFloat(combinedInputValues.sulfato_aluminio_dosificado);
     
      if (cloroDosificado > cloroNumber || sulfatoDosificado > sulfatoNumber) {
        setheader('!!Error');
        setMesaje('La cantidad de cloro o sulfato dosificado supera el valor en el inventario.');
        setShowCamposVaciosAlert(true);
        return; // Salir de la función sin guardar los datos
      }
        const cloroRestante = cloroNumber - cloroDosificado;
        const sulfatoRestante = sulfatoNumber - sulfatoDosificado; 
         if (!isNaN(cloroRestante) && combinedInputValues.cloro_dosificado) {
          const updatedInventory = {
            cloro: cloroRestante,
            sulfato: sulfatoRestante,   
          };
          await updateDoc(InveRef, { inventory: updatedInventory });      
        }
       
     }
 
    }

  
    const fechaClave = `${dia}-${mes}-${ano}`;
  
    combinedInputValues.usuario = usuario?.email
  

    await updateDoc(InveRef, {
      [`Produccion.${fechaClave}`]: combinedInputValues,
    })
      .then(() => {
        setheader('!!Exito');
        setMesaje('La valores fueron guardado  con exito.');
        setShowCamposVaciosAlert(true);
        
      })
      .catch((error) => {
        console.error('Error al guardar en el historico:', error);
      });


      // Actualizar la fecha de la última vez que se guardó
    const formattedDate = currentDate.toISOString();
    setLastSaveDate(formattedDate);
    localStorage.setItem('lastSaveDate', formattedDate);
    // Cierra la alerta de guardar
    setShowGuardarAlert(false);
  };



  return (
   <IonPage className="fondos">
      <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/dashboard-plant" />
              </IonButtons>
              <IonTitle>Reporte de Producción</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
      <IonItemGroup className='ion-margin, '>
        <IonItemDivider>
          <IonLabel>Clarificación</IonLabel>
        </IonItemDivider>
      
        <IonGrid>
          <IonRow>
            {groupOne.map((item) => {
              const key = item.name;
              return (
                <IonCol size="6" key={key}>
                  <IonItem lines='none'>
                    <IonInput className='border'
                      id={key}
                      label={item.label}
                      labelPlacement='stacked'
                      type={item.type}
                      placeholder={item.placeholder}
                      inputmode="numeric"
                      onIonInput={(e) => handleInputChange(key, e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              );
            })}
             
          </IonRow>
        </IonGrid>
      </IonItemGroup>
      <IonItemGroup className='ion-margin'>
        <IonItemDivider>
          <IonLabel>Desinfecion</IonLabel>
        </IonItemDivider>
        <IonGrid>
          <IonRow>
            {groupTwo.map((item) => {
              const key = item.name;
              return (
                <IonCol size="6" key={key}>
                  <IonItem lines='full'>
                    <IonInput
                      id={key}
                      label={item.label}
                      labelPlacement='stacked'
                      type={item.type}
                      placeholder={item.placeholder}
                      inputmode="numeric"
                      onIonInput={(e) => handleInputChange(key, e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              );
            })}
          </IonRow>
          <IonRow style={{ marginTop: '30px'}}>
          <IonTextarea class="texto-negro" label="Resumen del dia " onInput={(e)=> setReporte(e.target.value)} labelPlacement="floating" fill="outline" required></IonTextarea>
          </IonRow>
          <IonButton expand="full"onClick={handleShowTipoAlert}>
        Guardar
      </IonButton>
        </IonGrid>
      </IonItemGroup>
      </IonContent>
      <IonAlert
    isOpen={showCamposVaciosAlert}
    header={header}
    message={mensaje}
     buttons={[
    {
      text: 'OK',
      handler: () => {
        setShowCamposVaciosAlert(false);
        history.goBack(); // Aquí rediriges hacia atrás cuando se presiona "OK"
      },
    },
  ]}
/>
      <IonAlert
        isOpen={showTipoAlert}
        header="Tipo de Sulfato"
        message="¿Desea guardar como sulfato sólido o líquido?"
        buttons={[
          {
            text: 'Sólido',
            handler: () => handleTipoSulfatoSelected('solido'),
          },
          {
            text: 'Líquido',
            handler: () => handleTipoSulfatoSelected('liquido'),
          },
        ]}
      />

      <IonAlert
        isOpen={showGuardarAlert}
        header="Guardar Reporte"
        message={`¿Desea guardar el reporte como sulfato ${sulfatoType}?`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => setShowGuardarAlert(false),
          },
          {
            text: 'Guardar',
            handler: () => handleGuardar(),
          },
        ]}
      />
     
     </IonPage>

  )
}

export default Produccion;
