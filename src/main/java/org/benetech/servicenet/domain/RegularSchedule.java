package org.benetech.servicenet.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

/**
 * A RegularSchedule.
 */
@Entity
@Table(name = "regular_schedule")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class RegularSchedule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    @OneToOne
    @JoinColumn(unique = true)
    private Service srvc;

    @OneToOne
    @JoinColumn(unique = true)
    private Location location;

    @OneToOne
    @JoinColumn(unique = true)
    private ServiceAtLocation serviceAtlocation;

    @OneToMany(mappedBy = "regularSchedule")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<OpeningHours> openingHours = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Service getSrvc() {
        return srvc;
    }

    public RegularSchedule srvc(Service service) {
        this.srvc = service;
        return this;
    }

    public void setSrvc(Service service) {
        this.srvc = service;
    }

    public Location getLocation() {
        return location;
    }

    public RegularSchedule location(Location location) {
        this.location = location;
        return this;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public ServiceAtLocation getServiceAtlocation() {
        return serviceAtlocation;
    }

    public RegularSchedule serviceAtlocation(ServiceAtLocation serviceAtLocation) {
        this.serviceAtlocation = serviceAtLocation;
        return this;
    }

    public void setServiceAtlocation(ServiceAtLocation serviceAtLocation) {
        this.serviceAtlocation = serviceAtLocation;
    }

    public Set<OpeningHours> getOpeningHours() {
        return openingHours;
    }

    public RegularSchedule openingHours(Set<OpeningHours> openingHours) {
        this.openingHours = openingHours;
        return this;
    }

    public RegularSchedule addOpeningHours(OpeningHours openingHours) {
        this.openingHours.add(openingHours);
        openingHours.setRegularSchedule(this);
        return this;
    }

    public RegularSchedule removeOpeningHours(OpeningHours openingHours) {
        this.openingHours.remove(openingHours);
        openingHours.setRegularSchedule(null);
        return this;
    }

    public void setOpeningHours(Set<OpeningHours> openingHours) {
        this.openingHours = openingHours;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RegularSchedule regularSchedule = (RegularSchedule) o;
        if (regularSchedule.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), regularSchedule.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "RegularSchedule{" +
            "id=" + getId() +
            "}";
    }
}
