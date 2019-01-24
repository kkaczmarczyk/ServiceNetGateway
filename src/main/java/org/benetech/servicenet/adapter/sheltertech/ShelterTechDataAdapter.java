package org.benetech.servicenet.adapter.sheltertech;

import com.google.common.collect.Sets;
import org.benetech.servicenet.adapter.SingleDataAdapter;
import org.benetech.servicenet.adapter.shared.model.SingleImportData;
import org.benetech.servicenet.adapter.sheltertech.mapper.ShelterTechOrganizationMapper;
import org.benetech.servicenet.adapter.sheltertech.mapper.ShelterTechPhoneMapper;
import org.benetech.servicenet.adapter.sheltertech.mapper.ShelterTechPhysicalAddressMapper;
import org.benetech.servicenet.adapter.sheltertech.mapper.ShelterTechPostalAddressMapper;
import org.benetech.servicenet.adapter.sheltertech.mapper.ShelterTechRegularScheduleMapper;
import org.benetech.servicenet.adapter.sheltertech.mapper.ShelterTechServiceMapper;
import org.benetech.servicenet.adapter.sheltertech.model.AddressRaw;
import org.benetech.servicenet.adapter.sheltertech.model.OrganizationRaw;
import org.benetech.servicenet.adapter.sheltertech.model.ServiceRaw;
import org.benetech.servicenet.adapter.sheltertech.model.ShelterTechRawData;
import org.benetech.servicenet.domain.DataImportReport;
import org.benetech.servicenet.domain.Eligibility;
import org.benetech.servicenet.domain.Location;
import org.benetech.servicenet.domain.Organization;
import org.benetech.servicenet.domain.Phone;
import org.benetech.servicenet.domain.PhysicalAddress;
import org.benetech.servicenet.domain.PostalAddress;
import org.benetech.servicenet.domain.RegularSchedule;
import org.benetech.servicenet.domain.RequiredDocument;
import org.benetech.servicenet.domain.Service;
import org.benetech.servicenet.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.benetech.servicenet.adapter.sheltertech.ShelterTechConstants.PROVIDER_NAME;

@Component(PROVIDER_NAME + "DataAdapter")
public class ShelterTechDataAdapter extends SingleDataAdapter {

    @Autowired
    private ImportService importService;

    @Override
    @Transactional
    public DataImportReport importData(SingleImportData importData) {
        ShelterTechRawData data = ShelterTechParser.collectData(importData.getSingleObjectData());
        persistOrganizations(data, importData);

        return importData.getReport();
    }

    private void persistOrganizations(ShelterTechRawData parsedData, SingleImportData rawData) {
        for (OrganizationRaw orgRaw : parsedData.getOrganizations()) {
            Organization org = ShelterTechOrganizationMapper.INSTANCE.mapToOrganization(
                orgRaw, rawData.getReport().getDocumentUpload());
            persistOrgsLocation(orgRaw, org);

            org.setServices(persistServices(orgRaw, rawData.getReport()));

            Organization savedOrg = importService
                .createOrUpdateOrganization(org, org.getExternalDbId(), org.getProviderName(), rawData.getReport());
            persistPhones(orgRaw, savedOrg);
        }
    }

    private Set<Service> persistServices(OrganizationRaw organizationRaw, DataImportReport report) {
        Set<Service> services = new HashSet<>();
        for (ServiceRaw serviceRaw: organizationRaw.getServices()) {
            Service service = ShelterTechServiceMapper.INSTANCE.mapToService(serviceRaw);
            importService.createOrUpdateService(service, service.getExternalDbId(), service.getProviderName(), report);
            services.add(service);

            persistRegularSchedule(serviceRaw, service);
            persistEligibility(serviceRaw, service);
            persistRequiredDocuments(serviceRaw, service);
        }
        return services;
    }

    private void persistOrgsLocation(OrganizationRaw orgRaw, Organization org) {
        if (org.getLocation() == null) {
            return;
        }

        Location location = importService.createOrUpdateLocation(
            org.getLocation(), org.getLocation().getExternalDbId(), org.getLocation().getProviderName());
        org.setLocation(location);

        persistPostalAddress(orgRaw.getAddress(), location);

        persistPhysicalAddress(orgRaw.getAddress(), location);
    }

    private void persistPostalAddress(AddressRaw addressRaw, Location location) {
        PostalAddress postalAddress = ShelterTechPostalAddressMapper.INSTANCE
            .mapAddressRawToPostalAddress(addressRaw);
        if (postalAddress != null) {
            importService.createOrUpdatePostalAddress(postalAddress, location);
        }
    }

    private void persistPhysicalAddress(AddressRaw addressRaw, Location location) {
        PhysicalAddress physicalAddress = ShelterTechPhysicalAddressMapper.INSTANCE
            .mapAddressRawToPhysicalAddress(addressRaw);
        if (physicalAddress != null) {
            importService.createOrUpdatePhysicalAddress(physicalAddress, location);
        }
    }

    private void persistPhones(OrganizationRaw orgRaw, Organization orgSaved) {
        List<Phone> phones = ShelterTechPhoneMapper.INSTANCE.mapToPhones(
            orgRaw.getPhones().stream().filter(phone -> phone.getNumber() != null).collect(Collectors.toList()));
        for (Phone phone : phones) {
            phone.setOrganization(orgSaved);
            phone.setLocation(orgSaved.getLocation());
        }

        importService.createOrUpdatePhonesForOrganization(Sets.newHashSet(phones), orgSaved.getId());
    }

    private void persistRegularSchedule(ServiceRaw serviceRaw, Service savedService) {
        RegularSchedule schedule = ShelterTechRegularScheduleMapper.INSTANCE.mapToRegularSchedule(serviceRaw.getSchedule());
        if (schedule != null) {
            importService.createOrUpdateRegularSchedule(schedule, savedService);
        }
    }

    private void persistEligibility(ServiceRaw serviceRaw, Service savedService) {
        Eligibility eligibility = ShelterTechServiceMapper.INSTANCE.eligibilityFromString(serviceRaw.getEligibility());
        if (eligibility != null) {
            importService.createOrUpdateEligibility(eligibility, savedService);
        }
    }

    private void persistRequiredDocuments(ServiceRaw serviceRaw, Service savedService) {
        Set<RequiredDocument> requiredDocuments = ShelterTechServiceMapper.INSTANCE
            .docsFromString(serviceRaw.getRequiredDocuments());
        for (RequiredDocument doc : requiredDocuments) {
            importService.createOrUpdateRequiredDocument(doc, doc.getExternalDbId(), doc.getProviderName(), savedService);
        }
    }

}