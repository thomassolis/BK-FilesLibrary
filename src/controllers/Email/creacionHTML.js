const generarSaludoSegunHora = () => {
    const hora = new Date().getHours(); // Obtiene la hora actual
    if (hora >= 6 && hora < 12) {
        return "Buenos días";
    } else if (hora >= 12 && hora < 18) {
        return "Buenas tardes";
    } else {
        return "Buenas noches";
    }
};

String.prototype.toUpperCaseSafe = function () {
    return this ? this.toUpperCase() : '';
};

export const CreacionHtml= (comentarioGerente) =>
{

    const SaludoInicial = generarSaludoSegunHora();
    const ComentarioAdministrador = comentarioGerente?.toUpperCaseSafe();

    
    let hmltContent = ` <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <title>
    </title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        #outlook a {
        padding: 0;
        }

        body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        }

        table,
        td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        }

        img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
        }

        p {
        display: block;
        margin: 13px 0;
        }
    </style>
    <!--[if mso]>
            <noscript>
            <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
            </noscript>
            <![endif]-->
    <!--[if lte mso 11]>
            <style type="text/css">
            .mj-outlook-group-fix { width:100% !important; }
            </style>
            <![endif]-->
    <style type="text/css">
        @media only screen and (min-width:480px) {
        .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
        }
        }
    </style>
    <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
        }
    </style>
    <style type="text/css">
    </style>
    </head>

    <body style="word-spacing:normal;">
    <div style="">
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
            <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                        <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                            <p style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:100%;">
                            </p>
                            <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
    </td></tr></table><![endif]-->
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
            <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                        <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:black;">${SaludoInicial}, en el presente correo esta adjunto el archivo solicitado.</div>
                        </td>
                        </tr>
                        <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:black;">El Administrador que aprobo la solicitud, envio el siguiente comentario:</div>
                        </td>
                        </tr>
                        <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:black;">
                            <spam style="font-style:italic; padding-left:20">${ComentarioAdministrador}</spam>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
            <tbody>
            <tr>
                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                        <tr>
                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                            <p style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:100%;">
                            </p>
                            <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
    </td></tr></table><![endif]-->
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
    </body>
    </html>`

    return hmltContent
}

export const creacionNotificacionGerente = (ComentariOperador, NombreSolicitante, NombreArchivo, forAdmin) =>
{    
    const SaludoInicial = generarSaludoSegunHora();
    const ComentarioOperador = ComentariOperador?.toUpperCaseSafe();
    const linkPagina = 'https://netserpro.com:4303'

    const MensajeFinal = forAdmin?`Se Requiere que se apruebe la solicitud para enviar el Archivo al Solicitante por medio de correo electronico`:`Se Requiere que se apruebe la solicitud para ser enviada a un administrador que enviara el archivo; De no aceptar la soliciud no pasara a los administradores`

    return `
        <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

        <head>
        <title>
        </title>
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            #outlook a {
            padding: 0;
            }

            body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            }

            table,
            td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            }

            img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
            }

            p {
            display: block;
            margin: 13px 0;
            }
        </style>
        <!--[if mso]>
                <noscript>
                <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                </noscript>
                <![endif]-->
        <!--[if lte mso 11]>
                <style type="text/css">
                .mj-outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
        </style>
        <!--<![endif]-->
        <style type="text/css">
            @media only screen and (min-width:480px) {
            .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
            }
            }
        </style>
        <style media="screen and (min-width:480px)">
            .moz-text-html .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
            }
        </style>
        <style type="text/css">
        </style>
        </head>

        <body style="word-spacing:normal;">
        <div style="">
            <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            <div style="margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tbody>
                            <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <p style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:100%;">
                                </p>
                                <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
        </td></tr></table><![endif]-->
                            </td>
                            </tr>
                            <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:helvetica;font-size:20px;line-height:1;text-align:left;color:black;">${SaludoInicial}</div>
                            </td>
                            </tr>
                            <tr>
                            <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:helvetica;font-size:20px;line-height:2;text-align:justify;color:black;">
                                    ${NombreSolicitante} ha solicitado el Archivo: <strong>${NombreArchivo}</strong> con el siguiente comentario:
                                </div>
                            </td>

                            </tr>
                            <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                                <spam> ${ComentarioOperador} </spam>
                                </div>
                            </td>
                            </tr>
                            <tr>
                            <br>
                       
                            <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:helvetica;font-size:20px;line-height:2;text-align:justify;color:black;">${MensajeFinal}</div>
                            </td>
                            </tr>
                            <tr>
                            <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:45px;word-break:break-word;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                <tr>
                                    <td align="center" bgcolor="#e85034" role="presentation" style="border:none;border-radius:18px;cursor:auto;mso-padding-alt:10px 25px;background:#e85034;" valign="middle">
                                    <a href="${linkPagina}" style="display:inline-block;background:#e85034;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:18px;" target="_blank"> Click Aqui Para Ir a la Plataforma Web </a>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                            <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <p style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:100%;">
                                </p>
                                <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
        </td></tr></table><![endif]-->
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <!--[if mso | IE]></td></tr></table><![endif]-->
        </div>
        </body>

        </html>
    `

}

export const crearNotificacionAdminstrador = (data)=>
    {
        const saludoInicial = generarSaludoSegunHora();
        const NombreSolicitante = data.Nombre_de_solicitante?.toUpperCaseSafe()
        const NombreArchivo = data.Nombre_Archivo?.toUpperCaseSafe()
        const ComentarioOperador = data.motivo_de_la_solicitud?.toUpperCaseSafe()
        const NombreGerente = data.Gerente_que_aprobo_solicitud?.toUpperCaseSafe()
        const ComentarioGerente = data.Comentario_gerente?.toUpperCaseSafe()

        const LinkAplicacion = 'https://netserpro.com:4303'

        return `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>
  </title>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <noscript>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        </noscript>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    }
  </style>
  <style media="screen and (min-width:480px)">
    .moz-text-html .mj-column-per-100 {
      width: 100% !important;
      max-width: 100%;
    }
  </style>
  <style type="text/css">
  </style>
</head>

<body style="word-spacing:normal;">
  <div style="">
    <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <p style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:100%;">
                        </p>
                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:helvetica;font-size:18px;line-height:1;text-align:justify;color:#000000;">${saludoInicial}</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:helvetica;font-size:18px;line-height:2;text-align:justify;color:#000000;">${NombreSolicitante} ha solicitado el archivo: <strong>${NombreArchivo}</strong>, aportando el siguiente comentario:</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;padding-right:20px;padding-left:20px;word-break:break-word;">
                        <div style="font-family:helvetica;font-size:16px;line-height:1;text-align:left;color:#000000;"><span style="padding-left: 50px; font-style: italic;">${ComentarioOperador}</span></div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <p style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:100%;">
                        </p>
                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:helvetica;font-size:18px;line-height:2;text-align:justify;color:#000000;">El gerente ${NombreGerente} aprobó la solicitud dejando el siguiente comentario:</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;padding-right:20px;padding-left:20px;word-break:break-word;">
                        <div style="font-family:helvetica;font-size:16px;line-height:1.5;text-align:left;color:#000000;"><span style="padding-left: 50px; font-style: italic;">${ComentarioGerente}</span></div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <p style="border-top:solid 4px white;font-size:1px;margin:0px auto;width:100%;">
                        </p>
                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px white;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                      </td>
                    </tr>
                    <tr>
                      <td align="justify" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:helvetica;font-size:18px;line-height:2;text-align:justify;color:#000000;">Puede aceptar o rechazar la solicitud dando clic en el botón:</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                          <tr>
                            <td align="center" bgcolor="green" role="presentation" style="border:none;border-radius:5px;cursor:auto;mso-padding-alt:10px 25px;background:green;" valign="middle">
                              <a href="${LinkAplicacion}" style="display:inline-block;background:green;color:#ffffff;font-family:helvetica;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:5px;" target="_blank"> Acceder </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <p style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:100%;">
                        </p>
                        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px blue;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]></td></tr></table><![endif]-->
  </div>
</body>

</html>
        `
}