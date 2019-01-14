package org.benetech.servicenet.service.impl;

import org.benetech.servicenet.domain.AccessibilityForDisabilities;
import org.benetech.servicenet.domain.DataImportReport;
import org.benetech.servicenet.domain.Eligibility;
import org.benetech.servicenet.domain.Language;
import org.benetech.servicenet.domain.Location;
import org.benetech.servicenet.domain.OpeningHours;
import org.benetech.servicenet.domain.Organization;
import org.benetech.servicenet.domain.Phone;
import org.benetech.servicenet.domain.PhysicalAddress;
import org.benetech.servicenet.domain.PostalAddress;
import org.benetech.servicenet.domain.RegularSchedule;
import org.benetech.servicenet.domain.RequiredDocument;
import org.benetech.servicenet.domain.Service;
import org.benetech.servicenet.domain.ServiceAtLocation;
import org.benetech.servicenet.domain.ServiceTaxonomy;
import org.benetech.servicenet.domain.Taxonomy;
import org.benetech.servicenet.service.ImportService;
import org.benetech.servicenet.service.LocationService;
import org.benetech.servicenet.service.OrganizationMatchService;
import org.benetech.servicenet.service.OrganizationService;
import org.benetech.servicenet.service.RequiredDocumentService;
import org.benetech.servicenet.service.ServiceAtLocationService;
import org.benetech.servicenet.service.ServiceService;
import org.benetech.servicenet.service.ServiceTaxonomyService;
import org.benetech.servicenet.service.TaxonomyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class ImportServiceImpl implements ImportService {

    @Autowired
    private EntityManager em;

    @Autowired
    private LocationService locationService;

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private OrganizationMatchService organizationMatchService;

    @Autowired
    private ServiceAtLocationService serviceAtLocationService;

    @Autowired
    private TaxonomyService taxonomyService;

    @Autowired
    private ServiceTaxonomyService serviceTaxonomyService;

    @Autowired
    private RequiredDocumentService requiredDocumentService;

    @Override
    public Location createOrUpdateLocation(Location location, String externalDbId, String providerName) {
        Optional<Location> locationFromDb = locationService.findForExternalDb(externalDbId, providerName);
        if (locationFromDb.isPresent()) {
            location.setPhysicalAddress(locationFromDb.get().getPhysicalAddress());
            location.setPostalAddress(locationFromDb.get().getPostalAddress());
            location.setAccessibilities(locationFromDb.get().getAccessibilities());
            location.setId(locationFromDb.get().getId());
            em.merge(location);
        } else {
            em.persist(location);
        }
        return location;
    }

    @Override
    public PhysicalAddress createOrUpdatePhysicalAddress(PhysicalAddress physicalAddress, Location location) {
        if (location.getPhysicalAddress() != null) {
            physicalAddress.setId(location.getPhysicalAddress().getId());
            em.merge(physicalAddress);
        } else {
            physicalAddress.setLocation(location);
            em.persist(physicalAddress);
        }

        return physicalAddress;
    }

    @Override
    public PostalAddress createOrUpdatePostalAddress(PostalAddress postalAddress, Location location) {
        if (location.getPostalAddress() != null) {
            postalAddress.setId(location.getPostalAddress().getId());
            em.merge(postalAddress);
        } else {
            postalAddress.setLocation(location);
            em.persist(postalAddress);
        }

        return postalAddress;
    }

    @Override
    public AccessibilityForDisabilities createOrUpdateAccessibility(AccessibilityForDisabilities accessibility,
                                                                    Location location) {
        Optional<AccessibilityForDisabilities> existingAccessibility = getExistingAccessibility(accessibility, location);
        if (existingAccessibility.isPresent()) {
            accessibility.setId(existingAccessibility.get().getId());
            em.merge(accessibility);
        } else {
            accessibility.setLocation(location);
            em.persist(accessibility);
        }

        return accessibility;
    }

    @Override
    public Organization createOrUpdateOrganization(Organization organization, String externalDbId, String providerName,
                                                   DataImportReport report) {
        Optional<Organization> organizationFromDb = organizationService.findForExternalDb(externalDbId, providerName);
        if (organizationFromDb.isPresent()) {
            organization.setId(organizationFromDb.get().getId());
            em.merge(organization);
            report.incrementNumberOfUpdatedOrgs();
        } else {
            em.persist(organization);
            report.incrementNumberOfCreatedOrgs();
        }

        organizationMatchService.createOrUpdateOrganizationMatches(organization);
        return organization;
    }

    @Override
    public Service createOrUpdateService(Service service, String externalDbId, String providerName,
                                         DataImportReport report) {
        Optional<Service> serviceFromDb = serviceService.findForExternalDb(externalDbId, providerName);
        if (serviceFromDb.isPresent()) {
            service.setPhones(serviceFromDb.get().getPhones());
            service.setEligibility(serviceFromDb.get().getEligibility());
            service.setId(serviceFromDb.get().getId());
            service.setRegularSchedule(serviceFromDb.get().getRegularSchedule());
            em.merge(service);
            report.incrementNumberOfUpdatedServices();
        } else {
            em.persist(service);
            report.incrementNumberOfCreatedServices();
        }
        return service;
    }

    @Override
    public Set<Phone> createOrUpdatePhones(Set<Phone> phones, Service service, Location location) {
        phones.forEach(phone ->  {
            phone.setSrvc(service);
            phone.setLocation(location);
        });

        Set<Phone> common = new HashSet<>(phones);
        common.retainAll(service.getPhones());

        service.getPhones().stream().filter(phone -> !common.contains(phone)).forEach(phone -> em.remove(phone));
        phones.stream().filter(phone -> !common.contains(phone)).forEach(phone -> em.persist(phone));

        return phones;
    }

    @Override
    public Eligibility createOrUpdateEligibility(Eligibility eligibility, Service service) {
        if (service.getEligibility() != null) {
            eligibility.setId(service.getEligibility().getId());
            em.merge(eligibility);
        } else {
            eligibility.setSrvc(service);
            em.persist(eligibility);
        }

        return eligibility;
    }

    @Override
    public Set<Language> createOrUpdateLangs(Set<Language> langs, Service service, Location location) {
        langs.forEach(lang ->  {
            lang.setSrvc(service);
            lang.setLocation(location);
        });

        Set<Language> common = new HashSet<>(langs);
        common.retainAll(service.getLangs());

        service.getLangs().stream().filter(lang -> !common.contains(lang)).forEach(lang -> em.remove(lang));
        langs.stream().filter(lang -> !common.contains(lang)).forEach(lang -> em.persist(lang));

        return langs;
    }

    @Override
    public Set<OpeningHours> createOrUpdateOpeningHours(Set<OpeningHours> openingHours, Service service, Location location) {
        RegularSchedule schedule = service.getRegularSchedule();
        if (schedule != null) {
            Set<OpeningHours> common = new HashSet<>(openingHours);
            common.retainAll(schedule.getOpeningHours());

            schedule.getOpeningHours().stream().filter(o -> !common.contains(o)).forEach(o -> em.remove(o));
            openingHours.stream().filter(o -> !common.contains(o)).forEach(o -> em.persist(o));

            em.merge(schedule.openingHours(new HashSet<>(openingHours)).location(location));
        } else {
            openingHours.forEach(o -> em.persist(o));
            em.persist(new RegularSchedule().openingHours(new HashSet<>(openingHours)).location(location).srvc(service));
        }

        return openingHours;
    }

    @Override
    public ServiceAtLocation createOrUpdateServiceAtLocation(ServiceAtLocation serviceAtLocation, String externalDbId,
                                                             String providerName, Service service, Location location) {
        serviceAtLocation.setSrvc(service);
        serviceAtLocation.setLocation(location);

        Optional<ServiceAtLocation> serviceAtLocationFromDb
            = serviceAtLocationService.findForExternalDb(externalDbId, providerName);

        if (serviceAtLocationFromDb.isPresent()) {
            serviceAtLocation.setId(serviceAtLocationFromDb.get().getId());
            return em.merge(serviceAtLocation);
        } else {
            em.persist(serviceAtLocation);
            return serviceAtLocation;
        }
    }

    @Override
    public Taxonomy createOrUpdateTaxonomy(Taxonomy taxonomy, String externalDbId, String providerName) {
        Optional<Taxonomy> taxonomyFromDb = taxonomyService.findForExternalDb(externalDbId, providerName);

        if (taxonomyFromDb.isPresent()) {
            taxonomy.setId(taxonomyFromDb.get().getId());
            return em.merge(taxonomy);
        } else {
            em.persist(taxonomy);
            return taxonomy;
        }
    }

    @Override
    public ServiceTaxonomy createOrUpdateServiceTaxonomy(ServiceTaxonomy serviceTaxonomy, String externalDbId,
                                                         String providerName, Service service, Taxonomy taxonomy) {
        serviceTaxonomy.setSrvc(service);
        serviceTaxonomy.setTaxonomy(taxonomy);

        Optional<ServiceTaxonomy> serviceTaxonomyFromDb
            = serviceTaxonomyService.findForExternalDb(externalDbId, providerName);

        if (serviceTaxonomyFromDb.isPresent()) {
            serviceTaxonomy.setId(serviceTaxonomyFromDb.get().getId());
            return em.merge(serviceTaxonomy);
        } else {
            em.persist(serviceTaxonomy);
            return serviceTaxonomy;
        }
    }

    @Override
    public RequiredDocument createOrUpdateRequiredDocument(RequiredDocument requiredDocument, String externalDbId,
                                                           String providerName, Service service) {
        requiredDocument.setSrvc(service);

        Optional<RequiredDocument> requiredDocumentFromDb
            = requiredDocumentService.findForExternalDb(externalDbId, providerName);

        if (requiredDocumentFromDb.isPresent()) {
            requiredDocument.setId(requiredDocumentFromDb.get().getId());
            return em.merge(requiredDocument);
        } else {
            em.persist(requiredDocument);
            return requiredDocument;
        }
    }

    private Optional<AccessibilityForDisabilities> getExistingAccessibility(AccessibilityForDisabilities accessibility,
                                                                            Location location) {
        return location.getAccessibilities().stream()
            .filter(a -> a.getAccessibility().equals(accessibility.getAccessibility()))
            .findFirst();
    }
}