import React, { useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBSwitch,
  MDBInputGroup,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Cookies from "js-cookie";
import { Fitbit } from "@mui/icons-material";
import DefaultAvatar from "../../assets/default_avatar.png";
import PUT from "../../utils/PUT";
import { json, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import POST from "../../utils/POSTPIC";
import { dark } from "@mui/material/styles/createPalette";

export default function Profile() {
  const user = JSON.parse(Cookies.get("user"));
  const [name, setName] = useState(user.name);
  const [picture, setPicture] = useState(user.picture);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [fetch, setFetch] = useState(false);
  const [picFetch, setPicFetch] = useState(false);
  const [CanChangePw, setChangePwAbility] = useState(false);
  const [CanChangeInfo, setChangeInfoAbility] = useState(false);
  const [pwFetch, setPwFetch] = useState(false);

  const changePw = async () => {
    if (!password) return toast.error("Mot de passe requis!");
    setPwFetch(true);
    const response = await PUT("users/" + user.id, {
      email: user.email,
      name: user.name,
      role_id: user.roles[0].id,
      password,
    });
    if (response.errors) toast.error(response.errors.password[0]);
    if (response.status === "success") toast.success(response.message);
    setPwFetch(false);
  };

  const updateUserInfo = async () => {
    setFetch(true);
    const respone = await PUT("users/" + user.id, {
      name,
      email,
      id: user.id,
      role_id: user.roles[0].id,
    });
    if (respone.status === "success") {
      toast.success(respone.message);
      Cookies.remove("user");
      Cookies.set("user", JSON.stringify(respone.data.user), { expires: 3 });
    }
    if (respone.errors && respone.errors.name)
      toast.error(respone.errors.name[0]);
    if (respone.errors && respone.errors.email)
      toast.error(respone.errors.email[0]);
    setFetch(false);
  };

  const handlePictureUpdateClick = () => {
    document.getElementById("picture").click();
  };

  const handlePictureUpdate = async (picture) => {
    setPicFetch(true);
    const formData = new FormData();
    formData.append("picture", picture);
    formData.append("user_id", user.id);

    try {
      const response = await POST("users/picture", formData);
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 3 });
      setPicture(response.data.user.picture);
      if (response.status === "success") toast.success(response.message);
      setPicFetch(false);
    } catch (error) {
      console.error("Error updating picture:", error);
      setPicFetch(false);
    }
  };

  return (
    <section className="" style={{ backgroundColor: "white" }}>
      <ToastContainer className="mt-6" />
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center flex flex-col items-center">
                {picture === null ? (
                  <MDBCardImage
                    src={DefaultAvatar}
                    alt="avatar"
                    className="rounded-circle mb-4"
                    style={{ width: "150px" }}
                    fluid
                  />
                ) : (
                  <MDBCardImage
                    src={picture}
                    alt="avatar"
                    className="rounded-circle mb-4"
                    style={{ width: "150px" }}
                    fluid
                  />
                )}
                <p className="text-gray-800">{user.name}</p>
                {user.roles[0].name === "admin" ? (
                  <p className=" text-gray-600 mb-3">
                    L'administrateur de l'application
                  </p>
                ) : (
                  <p className="text-gray-600 mb-3">
                    Le sous-administrateur de l'application
                  </p>
                )}
                <div className="d-flex justify-content-center mb-2">
                  {picFetch ? (
                    <MDBBtn disabled color="dark">
                      <MDBSpinner
                        size="sm"
                        role="status"
                        tag="span"
                        className="mr-2"
                      />
                      Loading...
                    </MDBBtn>
                  ) : (
                    <MDBBtn
                      outline
                      color="black"
                      className="ms-1"
                      onClick={handlePictureUpdateClick}
                    >
                      Update Picture
                      <input
                        type="file"
                        name="picture"
                        id="picture"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={(e) => {
                          handlePictureUpdate(e.target.files[0]);
                        }}
                      />
                    </MDBBtn>
                  )}
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <Link to={'/archive'}>
                    <MDBListGroupItem className="d-flex hover:bg-gray-200 cursor-pointer justify-content-between align-items-center p-3">
                      <MDBCardText>Archives</MDBCardText>
                      <i class="fas fa-trash-can text-red-700"></i>
                    </MDBListGroupItem>
                  </Link>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="p-4 mb-4">
              <div className="my-6">
                <MDBSwitch
                  id="flexSwitchCheckDefault"
                  label="Changer les données de l'utilisateur"
                  checked={CanChangeInfo}
                  onChange={(e) => setChangeInfoAbility(e.target.checked)}
                />
              </div>
              {CanChangeInfo && (
                <form
                  className="w-[98%]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateUserInfo();
                  }}
                >
                  <MDBInputGroup textAfter="Name" className="mb-3">
                    <input
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      type="text"
                      placeholder="Username"
                    />
                  </MDBInputGroup>

                  <MDBInputGroup className="mb-3" textAfter="Email">
                    <input
                      className="form-control"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      type="text"
                      placeholder="Email"
                    />
                  </MDBInputGroup>

                  <MDBInputGroup
                    className="mb-3 cursor-not-allowed bg-gray-200"
                    disabled
                    textAfter="Role"
                  >
                    <input
                      disabled
                      className="form-control cursor-not-allowed"
                      value={user.roles[0].name.toUpperCase()}
                      type="text"
                      placeholder="Role"
                    />
                  </MDBInputGroup>
                  <div className="flex justify-end">
                    {fetch ? (
                      <MDBBtn disabled color="dark">
                        <MDBSpinner
                          size="sm"
                          role="status"
                          tag="span"
                          className="me-2"
                        />
                        Loading...
                      </MDBBtn>
                    ) : (
                      <MDBBtn className="w-20" color="dark">
                        Save
                      </MDBBtn>
                    )}
                  </div>
                </form>
              )}
            </MDBCard>
            <MDBCard className="p-4 mb-4">
              <div className="my-6">
                <MDBSwitch
                  id="flexSwitchCheckDefault"
                  label="Changer le mot de passe"
                  checked={CanChangePw}
                  onChange={(e) => setChangePwAbility(e.target.checked)}
                />
              </div>
              {CanChangePw && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    changePw();
                  }}
                >
                  <MDBInputGroup disabled textBefore="🔒" className="mb-3">
                    <input
                      className="form-control"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type="password"
                      placeholder="Tapez le nouveau mot de passe ici ..."
                    />
                  </MDBInputGroup>
                  <div className="flex justify-end">
                    {pwFetch ? (
                      <MDBBtn disabled color="dark">
                        <MDBSpinner
                          size="sm"
                          role="status"
                          tag="span"
                          className="me-2"
                        />
                        Loading...
                      </MDBBtn>
                    ) : (
                      <MDBBtn className="w-20" color="dark">
                        Save
                      </MDBBtn>
                    )}
                  </div>
                </form>
              )}
            </MDBCard>

            {/* <MDBRow>
              <MDBCol md="6">
                <MDBCard className="p-4 mb-md-0">
                  <MDBSwitch
                    id="flexSwitchCheckDefault"
                    label="Default switch checkbox input"
                  />
                  <br />
                  <MDBSwitch
                    defaultChecked
                    id="flexSwitchCheckChecked"
                    label="Checked switch checkbox input"
                  />
                  <br />
                  <MDBSwitch
                    disabled
                    id="flexSwitchCheckDisabled"
                    label="Disabled switch checkbox input"
                  />
                  <br />
                  <MDBSwitch
                    defaultChecked
                    disabled
                    id="flexSwitchCheckCheckedDisabled"
                    label="Disabled checked switch checkbox input"
                  />
                </MDBCard>
              </MDBCol>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1">
                        assigment
                      </span>{" "}
                      Project Status
                    </MDBCardText>
                    <MDBCardText
                      className="mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Web Design
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Website Markup
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      One Page
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Mobile Template
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                    </MDBProgress>

                    <MDBCardText
                      className="mt-4 mb-1"
                      style={{ fontSize: ".77rem" }}
                    >
                      Backend API
                    </MDBCardText>
                    <MDBProgress className="rounded">
                      <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow> */}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
