import React from "react";
import { Route, Switch } from "react-router-dom";

import MainWrapper from "./MainWrapper";
import PrivateRoute from "./PrivateRoute";
import FallbackSpinner from "../../shared/components/FallbackSpinner";
import ApplicationDetail from "../application/index";
import AssociatedCandidate from "../formation-condidate-by-entreprise";
import LogIn from "../login/index";
import DefaultDashboard from "../home/index";
import AddOffer from "../add-offer/index";
import AddActualité from "../add-actualité/index";
import AddFormation from "../add-formation";
import EntrepriseDetails from "../profile/index";
import EcoleDetails from "../entreprise-detail";
import ChangePassword from "../change-password/index";
import UsersList from "../users";
import Settings from "../settings/index";
import EmailDetail from "../email/index";
import MyOffers from "../offers/index";
import liste_formations from "../formation-entreprise/index";
import MesActualité from "../actualité/index";
import actualitéDetails from "../actualité-details/index";
import Offer from "../offer/index";
import MyOffer from "../offer-detail/index";
import CandidatProfil from "../candidat/index";
import MyCV from "../my-cv/index";
import MySharedCV from "../shared-cv/index";
import SearchCV from "../search-cv/index";
import Help from "../help/index";
import Legal from "../legal/index";
import RGPD from "../rgpd/index";

const privateRoutes = [
	{
		path: ["/", "/accueil"],
		component: DefaultDashboard,
		exact: true
	},
	{
		path: "/creation-une-offre",
		component: AddOffer,
		exact: true
	},
	{
		path: "/creation-une-actualité",
		component: AddActualité,
		exact: true
	},
	{
		path: "/creation-une-formation",
		component: AddFormation,
		exact: true
	},
	{
		path: "/compte",
		component: EntrepriseDetails,
		exact: true
	},
	{
		path: ["/parametres/:id", "/parametres"],
		component: Settings,
		exact: true
	},
	{
		path: "/changer-mot-de-passe",
		component: ChangePassword,
		exact: true
	},
	{
		path: "/user-list",
		component: UsersList,
		exact: true
	},
	{
		path: "/mes-offres",
		component: MyOffers,
		exact: true
	},
	{
		path: "/mes-formation",
		component: liste_formations,
		exact: true
	},
	{
		path: "/mes-actualités",
		component: MesActualité,
		exact: true
	},
	{
		path: "/actualité/:num",
		component: actualitéDetails,
		exact: true
	},
	{
		path: "/offre/:num",
		component: Offer,
		exact: true
	},
	{
		path: "/formation/:num",
		component: Offer,
		exact: true
	},
	{
		path: "/ecole/:num",
		component: EcoleDetails,
		exact: true
	},
	{
		path: "/rechercher-un-candidat",
		component: SearchCV,
		exact: true
	},

	{
		path: "/mon-offre/:num",
		component: MyOffer,
		exact: true
	},
	{
		path: "/emails/:id",
		component: EmailDetail,
		exact: true
	},
	{
		path: "/candidat/:num",
		component: CandidatProfil,
		exact: true
	},
	{
		path: "/candidature/:num",
		component: ApplicationDetail,
		exact: true
	},
	{
		path: "/associatedCanadidate/:num",
		component: AssociatedCandidate,
		exact: true
	},
	{
		path: "/tutoriel",
		component: Help,
		exact: true
	},
	{
		path: "/rgpd",
		component: RGPD,
		exact: true
	},
	{
		path: "/mention-legale",
		component: Legal,
		exact: true
	},
	{
		path: ["/mes-cv/:type", "/mes-cv"],
		component: MyCV,
		exact: true
	},

	{
		path: "/cv-partages",
		component: MySharedCV,
		exact: true
	}
];
const publicRoutes = [
	{
		path: ["/connexion/:token", "/connexion"],
		component: LogIn
	}
	/*  {
    path: "/mot-passe-oublie",
    component: ForgotPassword
  } */
];

const Router = () => (
	<React.Suspense fallback={<FallbackSpinner />}>
		<MainWrapper>
			<main>
				<Switch>
					{publicRoutes.map(route => <Route key={route.path} {...route} />)}
					<PrivateRoute>
						<Switch>{privateRoutes.map(route => <Route key={route.path} {...route} />)}</Switch>
					</PrivateRoute>
				</Switch>
			</main>
		</MainWrapper>
	</React.Suspense>
);

export default Router;
