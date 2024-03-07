
interface AppInput {
    name: string;
    label: string;
    placeholder: string;
    type: any;
  }
  
export  const groupOne: AppInput[] = [
    {
      name: 'caudal',
      label: 'Caudal (Q)',
      placeholder: '00',
      type: 'number'
    },
    {
      name: 'ntu_entrada',
      label: 'Ntu Entrada',
      placeholder: '00',
      type: 'number'
    },
    {
      name: 'ntu_salida',
      label: 'Ntu Salida',
      placeholder: '00',
      type: 'number'
    },
    {
      name: 'sulfato_aluminio_dosificado',
      label: 'Sulfato de aluminio dosificado',
      placeholder: '00',
      type: 'number'
    }
  ];
  
  export  const groupTwo: AppInput[] = [
    {
      name: 'UC_entrada',
      label: 'Dcl2',
      placeholder: '00',
      type: 'number'
    },
    {
      name: 'cloro_residual',
      label: 'Cloro residual (PPM)',
      placeholder: '00',
      type: 'number'
    },
    {
      name: 'cloro_dosificado',
      label: 'Cloro dosificado (Kg)',
      placeholder: '00',
      type: 'number'
    },
    {
      name: 'caudal_salidad',
      label: 'Caudal de salidad(Kg)',
      placeholder: '00',
      type: 'number'
    }
  ];