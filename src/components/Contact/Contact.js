import React, { useState, useEffect } from 'react';
import { Container, Grid, Button } from 'semantic-ui-react';

import { Contacto } from '../../images/icons/icons';
import { CustomInput } from '../inputsCustom/CustomInput';
import { SelectCustom } from '../inputsCustom/Select/Select';
import { relatives } from './data';

import { useHistory } from 'react-router-dom';
import { createContactoUrgente } from '../../redux/actions/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { CONECTION } from '../../conection';
import ContactElementComponent from './ContactElementComponent';
import { types } from '../../redux/types';

export default function Contact() {
  const state = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    fetch(`${CONECTION}api/emergency`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'x-auth-token': localStorage.getItem('refreshToken'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.data) {
          let array = contacts;
          data.data.map((item) => {
            let obj = {
              fullName: item.name,
              email: item.email,
              phone: item.phone,
              relative: item.kin,
              id: item.id,
            };
            array = [...array, obj];
          });
          dispatch({ type: types.getEmergencyContacts, payload: array });
        }
      });
  }, []);

  const [contacts, setContacts] = useState([]);
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    relative: '',
  });

  const { fullName, email, phone, relative } = formValues;

  const handleContact = () => {
    let array = contacts;
    let obj = {
      fullName: formValues.fullName,
      email: formValues.email,
      phone: formValues.phone,
      relative: formValues.relative,
    };
    array = [...array, obj];
    setContacts(array);

    const sendFormValues = {
      name: formValues.fullName,
      phone: formValues.phone,
      email: formValues.email,
      kin: formValues.relative,
    };

    dispatch(createContactoUrgente(sendFormValues, history));
    setFormValues({
      ...formValues,
      fullName: '',
      email: '',
      phone: '',
      relative: '',
    });
  };

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  return (
    <Container className="medical-contact">
      <Grid centered>
        <Grid.Row>
          <h1 className="title">Historial Médico</h1>
        </Grid.Row>
        <Grid.Row className="subtitle">
          <h2>Contactos de emergencia</h2>
        </Grid.Row>
        <Grid.Row className="icon">
          <Contacto />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column
            width={15}
            tablet={15}
            mobile={15}
            className="data-contact">
            <CustomInput
              placeholder="Nombre completo"
              type="text"
              setValue={(e) => setFormValues({ ...formValues, fullName: e })}
              value={fullName}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column
            computer={5}
            tablet={5}
            mobile={15}
            className="data-contact">
            <CustomInput
              placeholder="E-mail"
              type="text"
              setValue={(e) => setFormValues({ ...formValues, email: e })}
              value={email}
            />
          </Grid.Column>
          <Grid.Column
            computer={5}
            tablet={5}
            mobile={15}
            className="data-contact">
            <CustomInput
              placeholder="Teléfono"
              type="text"
              setValue={(e) => setFormValues({ ...formValues, phone: e })}
              value={phone}
            />
          </Grid.Column>
          <Grid.Column
            computer={5}
            tablet={5}
            mobile={15}
            className="data-contact">
            <SelectCustom
              placeholder="Parentesco"
              dataOptions={relatives}
              setValue={(e) => {
                console.log(e);
                setFormValues({ ...formValues, relative: e });
              }}
              value={relative}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="btn-add">
          <Grid.Column computer={15} tablet={15} mobile={15}>
            <Button onClick={() => handleContact()}>Agregar contacto</Button>
          </Grid.Column>
        </Grid.Row>

        {state.emergencyContacts.map((item, i) => (
          <ContactElementComponent key={item.id} {...item} />
        ))}
      </Grid>
    </Container>
  );
}
