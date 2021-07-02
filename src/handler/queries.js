import gql from "graphql-tag";

export const GET_COMPETENCES = gql`
	query getCompetences($search: String, $skip: Int, $limit: Int) {
		getCompetences(search: $search, skip: $skip, limit: $limit) {
			totalCount
			competences {
				id
				name
			}
		}
	}
`;

export const GET_JOBS = gql`
	query getJobs($search: String, $skip: Int, $limit: Int) {
		getJobs(search: $search, skip: $skip, limit: $limit) {
			totalCount
			jobs {
				id
				name
			}
		}
	}
`;
export const GET_SOFTSKILLS = gql`
	query getSoftskills($search: String, $skip: Int, $limit: Int) {
		getSoftskills(search: $search, skip: $skip, limit: $limit) {
			totalCount
			softskills {
				id
				name
			}
		}
	}
`;
export const GET_OFFER_BY_NUM = gql`
	query getOfferByNum($num: Int!) {
		getOfferByNum(num: $num) {
			id
			num
			name
			job {
				id
				name
			}
			city
			competences {
				id
				name
			}
			jobs {
				id
				name
			}
			softskills {
				id
				name
			}
			entreprise {
				id
				num
				name
				profile_pic_url
				name_of_in_charge
				address
				application_email
			}
			contract
			experience
			etude
			banner
			description_poste
			address
			extra_file
			salary
			salary_type
			work_time
			offreType
			applications {
				id
				state
				num
				experience
				disponibility
				createdAt
				profile
				candidat {
					id
					last_name
					num
					disponibility
					first_name
					jobs
					competences
					note
					contract
					experience
					etude
					profile_pic_url
					address
					cv
					cv_eng
					profile {
						id
						email
					}
				}
				createdAt
			}
			startEducation
			endEducation
			startApply
			endApply
			typeFormation
			dureeFormation
			endInternship
			startInternship
			application_number
			all_application_number
			dureeContract
			state
			createdAt
			expiredAt
			publishedAt
		}
	}
`;
export const GET_OFFERS_BY_STATUS = gql`
	query getOffersByState(
		$state: String
		$search: String
		$skip: Int
		$limit: Int
		$field: String
		$direction: Int
		$ent_type: String
	) {
		getOffersByState(
			state: $state
			search: $search
			skip: $skip
			limit: $limit
			field: $field
			direction: $direction
			ent_type: $ent_type
		) {
			offers {
				id
				num
				name
				city
				extra_file
				salary_type
				competences {
					id
					name
				}
				offreType
				startEducation
				endEducation
				startApply
				endApply
				typeFormation
				application_number
				all_application_number
				state
				contract
				expiredAt
				publishedAt
				createdAt
				dureeContract
			}
			totalCount
		}
	}
`;
export const GET_FORMATION_BY_ENTREPRISE = gql`
	query getFormationByEntreprise($search: String, $skip: Int, $limit: Int, $field: String, $direction: Int, $field2: String, $direction2: Int, $field3: String, $direction3: Int) {
		getFormationByEntreprise(search: $search, skip: $skip, limit: $limit, field: $field, direction: $direction, field2: $field2, direction2: $direction2, field3: $field3, direction3: $direction3) {
			offers {
				id
				num
				name
				city
				extra_file
				salary_type
				competences {
					id
					name
				}
				jobs {
					id
					name
				}
				entreprise {
					name
					profile_pic_url
				}
				startEducation
				endEducation
				startApply
				endApply
				typeFormation
				dureeFormation
				application_number
				all_application_number
				state
				contract
				expiredAt
				publishedAt
				createdAt
			}
			totalCount
		}
	}
`;

export const GET_ENTRPRISE_BY_NUM = gql`
	query getEntrepriseByNum($num: Int!) {
		getEntrepriseByNum(num: $num) {
			id
			userrs {
				id
				prenom
				name
				createdAt
				email
			}
		}
	}
`;
export const GET_OFFERS_STATS = gql`
	query getOffersStatByWeekEnterprise {
		getOffersStatByWeekEnterprise
	}
`;

export const GET_OFFERS_ACTIVE_STATS = gql`
	query getOffersActiveStatEnterprise {
		getOffersActiveStatEnterprise
	}
`;

export const GET_APPLICATIONS_PENDING = gql`
	query getPendingApplication {
		getPendingApplication
	}
`;

export const GET_APPLICATIONS_STATS = gql`
	query getApplicationsStatByWeekEnterprise {
		getApplicationsStatByWeekEnterprise
	}
`;
export const GET_MYCV_STATS = gql`
	query getMyCVSatat($ent_type: String,$uid: String) {
		getMyCVSatat(ent_type: $ent_type,uid: $uid)
	}
`;

export const GET_SETTINGS = gql`
	query getSettings {
		getSettings {
			rgpd
			legal
			tutoriel
		}
	}
`;

export const GET_ACTUALITIES = gql`
	query getActualite($state: String, $search: String, $skip: Int, $limit: Int, $field: String, $direction: Int,$allActus: String) {
		getActualite(state: $state, search: $search, skip: $skip, limit: $limit, field: $field, direction: $direction,allActus:$allActus) {
			ActualiteResult {
				_id
				num
				title
				description
				lien
				startPublication
				endPublication
				ent_type
				eventDate
				visibleToCandidat
				visibleToAdherent
				entreprise {
					num
					id
					name
					profile_pic_url
					name_of_in_charge
					address
				}
			}
			totalCount
		}
	}
`;

export const GET_ACTUALITY_BY_NUM = gql`
	query getActualiteByNum($num: Int!) {
		getActualiteByNum(num: $num) {
			_id
			title
			num
			description
			ent_type
			lien
			startPublication
			endPublication
			eventDate
			createdAt
		}
	}
`;
export const GET_ENTREPRISES_USERS = gql`
	query getEntrepriseUsers($search: String, $skip: Int, $limit: Int, $id: String!) {
		getEntrepriseUsers(search: $search, skip: $skip, limit: $limit, id: $id) {
			totalCount
			users {
				id
				email
				is_verified
				is_blocked
				is_blocked_by_admin
				createdAt
				is_holder
				name
				prenom
				isleader
			}
		}
	}
`;
export const GET_ANNOTATION = gql`
	query getAnnotation($entreprise_id: String, $candidate_id: String) {
		getAnnotation(entreprise_id: $entreprise_id, candidate_id: $candidate_id) {
			totalCount
			AnnotationResult {
				id
				commentaire
				createdAt
				entreprise {
					id
					name
				}
				user {
					id
					name
					prenom
					isleader
					email
				}
				created
			}
		}
	}
`;
export const GET_CANDIDAT_BY_NUM = gql`
  query getCandidatByNum($num: Int!) {
    getCandidatByNum(num: $num) {
      id
      last_name
      first_name
      jobs
      num
      competences
      softskills
      note
      address
      letter
      sharedby
      sharedcv
      contract
      twitter
      siteweb
      linkedin
      experience
      disponibility
      age
      sexe
      entreprises {
        isFavoris
        id
      }
      tel
      etude
      profile_pic_url
      address
      cv
      cv_eng
      profile {
        id
        email
        is_blocked
        is_blocked_by_admin
      }
      createdAt
    }
  }
`;

